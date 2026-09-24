import ast
import logging
from typing import Dict, List, Optional, Tuple, Set

from .symbols import Scope, Symbol, TaintState, EvidencePath
from .sources import SourceRegistry
from .sanitizers import SanitizerRegistry

logger = logging.getLogger("securelens.dataflow")

class DataFlowAnalyzer(ast.NodeVisitor):
    """
    Intra-procedural Data-Flow & Taint Propagation Engine.
    Traverses AST scopes, tracking symbol definitions, alias relationships,
    expression propagation (f-strings, concatenations), tuple unpacking,
    conservative branch (may-taint) handling, and reassignment kill-gen.
    """

    def __init__(self):
        self.global_scope = Scope(scope_id="global", name="<module>")
        self.current_scope: Scope = self.global_scope
        self.all_scopes: Dict[str, Scope] = {"global": self.global_scope}
        self._scope_counter = 0

    def analyze(self, tree: ast.AST):
        """Runs intra-procedural data-flow analysis on the AST."""
        self.visit(tree)

    def generic_visit(self, node: ast.AST):
        node._scope = self.current_scope
        super().generic_visit(node)

    def _enter_scope(self, name: str) -> Scope:
        self._scope_counter += 1
        scope_id = f"scope_{self._scope_counter}_{name}"
        new_scope = Scope(scope_id=scope_id, name=name, parent=self.current_scope)
        self.all_scopes[scope_id] = new_scope
        self.current_scope = new_scope
        return new_scope

    def _exit_scope(self):
        if self.current_scope.parent:
            self.current_scope = self.current_scope.parent

    def visit_FunctionDef(self, node: ast.FunctionDef):
        node._scope = self.current_scope
        self._enter_scope(node.name)
        for arg in node.args.args:
            sym = Symbol(name=arg.arg, scope_id=self.current_scope.scope_id, state=TaintState.UNKNOWN)
            self.current_scope.set_symbol(sym)
        for item in node.body:
            self.visit(item)
        self._exit_scope()

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef):
        node._scope = self.current_scope
        self._enter_scope(node.name)
        for arg in node.args.args:
            sym = Symbol(name=arg.arg, scope_id=self.current_scope.scope_id, state=TaintState.UNKNOWN)
            self.current_scope.set_symbol(sym)
        for item in node.body:
            self.visit(item)
        self._exit_scope()

    def visit_If(self, node: ast.If):
        node._scope = self.current_scope
        # Snapshot current scope symbols before branching
        before_state = {
            name: (sym.state, sym.source_expr, sym.source_line, sym.is_constant, sym.is_dynamic_expression, list(sym.propagation_path))
            for name, sym in self.current_scope.symbols.items()
        }

        # 1. Execute then-branch
        for stmt in node.body:
            self.visit(stmt)
        then_state = {
            name: (sym.state, sym.source_expr, sym.source_line, sym.is_constant, sym.is_dynamic_expression, list(sym.propagation_path))
            for name, sym in self.current_scope.symbols.items()
        }

        # 2. Reset symbols to before-state before entering else-branch
        current_names = list(self.current_scope.symbols.keys())
        for name in current_names:
            if name in before_state:
                st, src, ln, const, dyn, path = before_state[name]
                sym = self.current_scope.symbols[name]
                sym.state, sym.source_expr, sym.source_line, sym.is_constant, sym.is_dynamic_expression, sym.propagation_path = st, src, ln, const, dyn, list(path)
            else:
                del self.current_scope.symbols[name]

        # 3. Execute else-branch
        for stmt in node.orelse:
            self.visit(stmt)
        else_state = {
            name: (sym.state, sym.source_expr, sym.source_line, sym.is_constant, sym.is_dynamic_expression, list(sym.propagation_path))
            for name, sym in self.current_scope.symbols.items()
        }

        # 4. Conservative Union (May-Taint Semantics)
        all_branch_names = set(then_state.keys()).union(set(else_state.keys()))
        for name in all_branch_names:
            then_info = then_state.get(name)
            else_info = else_state.get(name)

            sym = self.current_scope.symbols.get(name)
            if not sym:
                sym = Symbol(name=name, scope_id=self.current_scope.scope_id)
                self.current_scope.symbols[name] = sym

            # If tainted in EITHER branch -> TAINTED
            if then_info and then_info[0] == TaintState.TAINTED:
                sym.state = TaintState.TAINTED
                sym.source_expr, sym.source_line, sym.is_constant, sym.is_dynamic_expression, sym.propagation_path = then_info[1], then_info[2], False, then_info[4], list(then_info[5])
            elif else_info and else_info[0] == TaintState.TAINTED:
                sym.state = TaintState.TAINTED
                sym.source_expr, sym.source_line, sym.is_constant, sym.is_dynamic_expression, sym.propagation_path = else_info[1], else_info[2], False, else_info[4], list(else_info[5])
            elif then_info and then_info[0] == TaintState.SANITIZED:
                sym.state = TaintState.SANITIZED
                sym.source_expr, sym.source_line, sym.is_constant, sym.is_dynamic_expression, sym.propagation_path = then_info[1], then_info[2], False, then_info[4], list(then_info[5])
            elif else_info and else_info[0] == TaintState.SANITIZED:
                sym.state = TaintState.SANITIZED
                sym.source_expr, sym.source_line, sym.is_constant, sym.is_dynamic_expression, sym.propagation_path = else_info[1], else_info[2], False, else_info[4], list(else_info[5])

    def _assign_single_target(self, target_node: ast.AST, val_node: ast.AST, line: int):
        target_node._scope = self.current_scope
        if isinstance(target_node, ast.Name):
            var_name = target_node.id
            # Fix scope shadowing: look up ONLY in current scope's local symbols dict
            sym = self.current_scope.symbols.get(var_name)
            if not sym:
                sym = Symbol(name=var_name, scope_id=self.current_scope.scope_id)
                self.current_scope.symbols[var_name] = sym

            taint_state, source_desc, s_line, parent_sym, is_const = self._evaluate_expression(val_node, line, self.current_scope)
            step_desc = f"{var_name} = {ast.unparse(val_node)} (line {line})"
            is_dynamic = isinstance(val_node, (ast.JoinedStr, ast.BinOp)) or (
                isinstance(val_node, ast.Call) and isinstance(val_node.func, ast.Attribute) and val_node.func.attr == 'format'
            )
            sym.is_dynamic_expression = is_dynamic

            if taint_state == TaintState.TAINTED:
                if parent_sym:
                    sym.alias_from(parent_sym, step_desc)
                else:
                    sym.mark_tainted(source_desc or ast.unparse(val_node), s_line or line, step_desc)
            elif taint_state == TaintState.UNTAINTED:
                sym.mark_untainted(step_desc, is_constant=is_const)
            elif taint_state == TaintState.SANITIZED:
                sym.mark_sanitized(source_desc or "sanitizer", step_desc)
            else:
                sym.state = TaintState.UNKNOWN
                if parent_sym and parent_sym.is_dynamic_expression:
                    sym.is_dynamic_expression = True

    def visit_Assign(self, node: ast.Assign):
        node._scope = self.current_scope
        val = node.value
        val._scope = self.current_scope

        for target in node.targets:
            target._scope = self.current_scope
            if isinstance(target, (ast.Tuple, ast.List)):
                if isinstance(val, (ast.Tuple, ast.List)) and len(target.elts) == len(val.elts):
                    for t_elem, v_elem in zip(target.elts, val.elts):
                        self._assign_single_target(t_elem, v_elem, node.lineno)
                else:
                    t_state, s_desc, s_line, p_sym, is_const = self._evaluate_expression(val, node.lineno, self.current_scope)
                    for t_elem in target.elts:
                        if isinstance(t_elem, ast.Name):
                            sym = self.current_scope.symbols.get(t_elem.id)
                            if not sym:
                                sym = Symbol(name=t_elem.id, scope_id=self.current_scope.scope_id)
                                self.current_scope.symbols[t_elem.id] = sym
                            step_desc = f"{t_elem.id} = {ast.unparse(val)} (line {node.lineno})"
                            if t_state == TaintState.TAINTED:
                                if p_sym:
                                    sym.alias_from(p_sym, step_desc)
                                else:
                                    sym.mark_tainted(s_desc or ast.unparse(val), s_line or node.lineno, step_desc)
                            elif t_state == TaintState.UNTAINTED:
                                sym.mark_untainted(step_desc, is_constant=is_const)
                            elif t_state == TaintState.SANITIZED:
                                sym.mark_sanitized(s_desc or "sanitizer", step_desc)
            else:
                self._assign_single_target(target, val, node.lineno)

        self.generic_visit(node)

    def visit_AugAssign(self, node: ast.AugAssign):
        node._scope = self.current_scope
        node.value._scope = self.current_scope
        if isinstance(node.target, ast.Name):
            node.target._scope = self.current_scope
            var_name = node.target.id
            taint_state, source_desc, line, parent_sym, is_const = self._evaluate_expression(node.value, node.lineno, self.current_scope)
            sym = self.current_scope.symbols.get(var_name)
            if not sym:
                sym = Symbol(name=var_name, scope_id=self.current_scope.scope_id)
                self.current_scope.symbols[var_name] = sym

            sym.is_dynamic_expression = True
            if taint_state == TaintState.TAINTED or sym.state == TaintState.TAINTED:
                sym.state = TaintState.TAINTED
                step_desc = f"{var_name} += {ast.unparse(node.value)} (line {node.lineno})"
                if parent_sym and parent_sym.source_expr:
                    sym.source_expr = parent_sym.source_expr
                    sym.source_line = parent_sym.source_line
                elif not sym.source_expr:
                    sym.source_expr = source_desc or ast.unparse(node.value)
                    sym.source_line = line or node.lineno
                sym.propagation_path.append(step_desc)
        self.generic_visit(node)

    def _evaluate_expression(
        self, node: ast.AST, current_line: int, scope: Optional[Scope] = None
    ) -> Tuple[TaintState, Optional[str], Optional[int], Optional[Symbol], bool]:
        """
        Recursively evaluates the taint state of an expression node.
        Returns: (TaintState, source_description, source_line, parent_symbol, is_constant)
        """
        active_scope = scope or getattr(node, '_scope', self.current_scope)

        # 1. Direct Untrusted Source Check
        is_source, source_desc = SourceRegistry.is_untrusted_source(node)
        if is_source:
            return TaintState.TAINTED, source_desc, current_line, None, False

        # 2. Sanitizers & Neutralization Boundaries
        # Type cast sanitizer: int(), float(), bool()
        if SanitizerRegistry.is_type_coercion(node):
            return TaintState.UNTAINTED, "type_coercion", current_line, None, False

        # Command Sanitizer: shlex.quote()
        is_cmd_san, san_name = SanitizerRegistry.is_command_sanitizer(node)
        if is_cmd_san:
            return TaintState.SANITIZED, san_name or "shlex.quote", current_line, None, False

        # Path Sanitizer: os.path.basename(), secure_filename()
        is_path_san, path_san_name = SanitizerRegistry.is_path_sanitizer(node)
        if is_path_san:
            return TaintState.SANITIZED, path_san_name or "path_sanitizer", current_line, None, False

        # 3. Simple Variable Name (Alias)
        if isinstance(node, ast.Name):
            sym = active_scope.get_symbol(node.id)
            if sym:
                return sym.state, sym.source_expr, sym.source_line, sym, sym.is_constant
            return TaintState.UNKNOWN, None, None, None, False

        # 4. Constant Literal
        if isinstance(node, ast.Constant):
            return TaintState.UNTAINTED, None, None, None, True

        # 5. String Concatenation / Binary Operations (BinOp)
        if isinstance(node, ast.BinOp):
            left_state, l_desc, l_line, l_sym, l_const = self._evaluate_expression(node.left, current_line, active_scope)
            right_state, r_desc, r_line, r_sym, r_const = self._evaluate_expression(node.right, current_line, active_scope)

            if left_state == TaintState.TAINTED:
                return TaintState.TAINTED, l_desc, l_line, l_sym, False
            if right_state == TaintState.TAINTED:
                return TaintState.TAINTED, r_desc, r_line, r_sym, False

            # Neutralized: both sides are either UNTAINTED or SANITIZED
            if left_state in (TaintState.UNTAINTED, TaintState.SANITIZED) and right_state in (TaintState.UNTAINTED, TaintState.SANITIZED):
                if left_state == TaintState.SANITIZED or right_state == TaintState.SANITIZED:
                    return TaintState.SANITIZED, None, None, None, False
                return TaintState.UNTAINTED, None, None, None, (l_const and r_const)

            return TaintState.UNKNOWN, None, None, None, False

        # 6. F-Strings (JoinedStr)
        if isinstance(node, ast.JoinedStr):
            has_tainted = False
            has_unknown = False
            has_sanitized = False
            tainted_desc, tainted_line, tainted_sym = None, None, None
            all_consts = True

            for part in node.values:
                if isinstance(part, ast.FormattedValue):
                    p_state, p_desc, p_line, p_sym, p_const = self._evaluate_expression(part.value, current_line, active_scope)
                    if p_state == TaintState.TAINTED:
                        has_tainted = True
                        tainted_desc, tainted_line, tainted_sym = p_desc, p_line, p_sym
                    elif p_state == TaintState.UNKNOWN:
                        has_unknown = True
                    elif p_state == TaintState.SANITIZED:
                        has_sanitized = True
                    if not p_const:
                        all_consts = False

            if has_tainted:
                return TaintState.TAINTED, tainted_desc, tainted_line, tainted_sym, False
            if has_unknown:
                return TaintState.UNKNOWN, None, None, None, False
            if has_sanitized:
                return TaintState.SANITIZED, None, None, None, False
            return TaintState.UNTAINTED, None, None, None, all_consts

        # 7. str.format() Call
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and node.func.attr == 'format':
            has_tainted = False
            has_unknown = False
            has_sanitized = False
            for arg in node.args:
                a_state, a_desc, a_line, a_sym, a_const = self._evaluate_expression(arg, current_line, active_scope)
                if a_state == TaintState.TAINTED:
                    has_tainted = True
                elif a_state == TaintState.UNKNOWN:
                    has_unknown = True
                elif a_state == TaintState.SANITIZED:
                    has_sanitized = True
            for kw in node.keywords:
                k_state, k_desc, k_line, k_sym, k_const = self._evaluate_expression(kw.value, current_line, active_scope)
                if k_state == TaintState.TAINTED:
                    has_tainted = True
                elif k_state == TaintState.UNKNOWN:
                    has_unknown = True
                elif k_state == TaintState.SANITIZED:
                    has_sanitized = True

            if has_tainted:
                return TaintState.TAINTED, None, None, None, False
            if has_unknown:
                return TaintState.UNKNOWN, None, None, None, False
            if has_sanitized:
                return TaintState.SANITIZED, None, None, None, False
            return TaintState.UNTAINTED, None, None, None, False

        return TaintState.UNKNOWN, None, None, None, False

    def get_taint_info(self, node: ast.AST) -> Tuple[TaintState, Optional[Symbol], Optional[str], Optional[int]]:
        """
        Evaluates the taint state of an argument expression at a sink.
        Returns: (TaintState, Symbol, source_description, source_line)
        """
        active_scope = getattr(node, '_scope', self.current_scope)
        state, source_desc, line, sym, _ = self._evaluate_expression(node, getattr(node, 'lineno', 0), active_scope)
        return state, sym, source_desc, line

    def build_evidence(
        self, sink_node: ast.AST, tainted_symbol: Optional[Symbol], 
        fallback_source: Optional[str] = None, fallback_line: Optional[int] = None,
        sanitizer: Optional[str] = None
    ) -> EvidencePath:
        """
        Constructs an EvidencePath detailing the source, intermediate propagation steps, and sink.
        """
        sink_snippet = ast.unparse(sink_node)
        sink_desc = f"{sink_snippet} (line {getattr(sink_node, 'lineno', 0)})"
        
        if tainted_symbol:
            source_desc = f"{tainted_symbol.source_expr} (line {tainted_symbol.source_line})"
            flow = list(tainted_symbol.propagation_path)
            return EvidencePath(
                source=source_desc,
                sink=sink_desc,
                flow=flow,
                sanitizer=sanitizer,
                analysis_type="taint_dataflow"
            )
        else:
            source_desc = f"{fallback_source or 'untrusted_input'} (line {fallback_line or 0})"
            return EvidencePath(
                source=source_desc,
                sink=sink_desc,
                flow=[f"Direct flow into sink: {sink_snippet}"],
                sanitizer=sanitizer,
                analysis_type="taint_dataflow"
            )
