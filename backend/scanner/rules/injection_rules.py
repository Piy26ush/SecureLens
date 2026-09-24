import ast
from . import BaseRule
from backend.scanner.analyzer import (
    TaintState,
    SinkRegistry,
    SanitizerRegistry
)

class EvalExecRule(BaseRule):
    """
    Rule 1: Detects dangerous usage of eval() and exec() which allow arbitrary code execution.
    Augmented with Taint DataFlow analysis to trace source provenance.
    """
    def visit_Call(self, node: ast.Call):
        if isinstance(node.func, ast.Name) and node.func.id in ('eval', 'exec'):
            evidence = None
            detection_method = "ast_structural"
            
            if node.args and hasattr(self.visitor, 'dataflow') and self.visitor.dataflow:
                first_arg = node.args[0]
                taint_state, sym, src_desc, src_line = self.visitor.dataflow.get_taint_info(first_arg)
                if taint_state == TaintState.TAINTED:
                    evidence_path = self.visitor.dataflow.build_evidence(node, sym, src_desc, src_line)
                    evidence = evidence_path.to_dict()
                    detection_method = "taint_dataflow"

            self.add_finding(
                type_key="eval_exec",
                line=node.lineno,
                severity="CRITICAL",
                snippet=ast.unparse(node),
                cwe_id="CWE-95",
                owasp_id="A03:2021",
                evidence=evidence,
                detection_method=detection_method
            )

class SqlInjectionRule(BaseRule):
    """
    Rule 2: Detects SQL Injection in database execution sinks (cursor.execute, raw, etc.).
    Uses Taint DataFlow tracking to distinguish tainted flows from parameterized/safe queries.
    """
    def visit_Call(self, node: ast.Call):
        if not SinkRegistry.is_sql_sink(node):
            return

        if not node.args:
            return

        # 1. Parameterized Query Check (Safe Boundary)
        is_parameterized, _ = SanitizerRegistry.is_sql_parameterized(node)
        if is_parameterized:
            return

        first_arg = node.args[0]
        dataflow = getattr(self.visitor, 'dataflow', None)

        if dataflow:
            taint_state, sym, src_desc, src_line = dataflow.get_taint_info(first_arg)
            
            # Tainted flow
            if taint_state == TaintState.TAINTED:
                evidence_path = dataflow.build_evidence(node, sym, src_desc, src_line)
                self.add_finding(
                    type_key="sql_injection",
                    line=node.lineno,
                    severity="HIGH",
                    snippet=ast.unparse(node),
                    cwe_id="CWE-89",
                    owasp_id="A03:2021",
                    evidence=evidence_path.to_dict(),
                    detection_method="taint_dataflow"
                )
                return
            elif taint_state == TaintState.UNTAINTED:
                return
            elif sym and sym.is_dynamic_expression:
                self.add_finding(
                    type_key="sql_injection",
                    line=node.lineno,
                    severity="HIGH",
                    snippet=ast.unparse(node),
                    cwe_id="CWE-89",
                    owasp_id="A03:2021",
                    detection_method="ast_heuristic"
                )
                return

        # Fallback heuristic: flag un-parameterized dynamic syntax constructs (f-strings, BinOp concatenation)
        is_dynamic = False
        if isinstance(first_arg, (ast.JoinedStr, ast.BinOp)):
            is_dynamic = True
        elif (isinstance(first_arg, ast.Call) and 
              isinstance(first_arg.func, ast.Attribute) and 
              first_arg.func.attr == 'format'):
            is_dynamic = True

        if is_dynamic:
            self.add_finding(
                type_key="sql_injection",
                line=node.lineno,
                severity="HIGH",
                snippet=ast.unparse(node),
                cwe_id="CWE-89",
                owasp_id="A03:2021",
                detection_method="ast_heuristic"
            )

class CommandInjectionRule(BaseRule):
    """
    Rule 3: Detects Command Injection (os.system, subprocess.run, os.popen, etc.).
    Uses Taint DataFlow analysis to trace untrusted inputs to command sinks.
    """
    def visit_Call(self, node: ast.Call):
        if not SinkRegistry.is_command_sink(node):
            return

        if not node.args:
            return

        first_arg = node.args[0]

        # 1. Pure constant string without dynamic vars is safe
        if isinstance(first_arg, ast.Constant) and isinstance(first_arg.value, str):
            return

        # 2. Check if subprocess call with list of constants without shell=True
        if isinstance(first_arg, ast.List):
            all_consts = all(isinstance(elt, ast.Constant) for elt in first_arg.elts)
            has_shell_true = any(
                kw.arg == 'shell' and isinstance(kw.value, ast.Constant) and kw.value.value is True 
                for kw in node.keywords
            )
            if all_consts and not has_shell_true:
                return

        dataflow = getattr(self.visitor, 'dataflow', None)
        if dataflow:
            taint_state, sym, src_desc, src_line = dataflow.get_taint_info(first_arg)
            if taint_state == TaintState.TAINTED:
                evidence_path = dataflow.build_evidence(node, sym, src_desc, src_line)
                self.add_finding(
                    type_key="command_injection",
                    line=node.lineno,
                    severity="HIGH",
                    snippet=ast.unparse(node),
                    cwe_id="CWE-78",
                    owasp_id="A03:2021",
                    evidence=evidence_path.to_dict(),
                    detection_method="taint_dataflow"
                )
                return
            elif taint_state == TaintState.UNTAINTED:
                return
            elif sym and sym.is_dynamic_expression:
                self.add_finding(
                    type_key="command_injection",
                    line=node.lineno,
                    severity="HIGH",
                    snippet=ast.unparse(node),
                    cwe_id="CWE-78",
                    owasp_id="A03:2021",
                    detection_method="ast_heuristic"
                )
                return

        # Fallback heuristic
        self.add_finding(
            type_key="command_injection",
            line=node.lineno,
            severity="HIGH",
            snippet=ast.unparse(node),
            cwe_id="CWE-78",
            owasp_id="A03:2021",
            detection_method="ast_heuristic"
        )

class PathTraversalRule(BaseRule):
    """
    Rule 4: Detects Path Traversal vulnerabilities when file paths in open() receive tainted inputs.
    """
    def visit_Call(self, node: ast.Call):
        if not SinkRegistry.is_file_sink(node):
            return

        if not node.args:
            return

        first_arg = node.args[0]
        if isinstance(first_arg, ast.Constant) and isinstance(first_arg.value, str):
            # Static file path literal -> Safe
            return

        dataflow = getattr(self.visitor, 'dataflow', None)
        if dataflow:
            taint_state, sym, src_desc, src_line = dataflow.get_taint_info(first_arg)
            if taint_state == TaintState.TAINTED:
                evidence_path = dataflow.build_evidence(node, sym, src_desc, src_line)
                self.add_finding(
                    type_key="path_traversal",
                    line=node.lineno,
                    severity="MEDIUM",
                    snippet=ast.unparse(node),
                    cwe_id="CWE-22",
                    owasp_id="A01:2021",
                    evidence=evidence_path.to_dict(),
                    detection_method="taint_dataflow"
                )
                return
            elif taint_state == TaintState.UNTAINTED:
                return
            elif sym and sym.is_dynamic_expression:
                self.add_finding(
                    type_key="path_traversal",
                    line=node.lineno,
                    severity="MEDIUM",
                    snippet=ast.unparse(node),
                    cwe_id="CWE-22",
                    owasp_id="A01:2021",
                    detection_method="ast_heuristic"
                )
                return

        # Fallback heuristic
        if isinstance(first_arg, (ast.JoinedStr, ast.BinOp)):
            self.add_finding(
                type_key="path_traversal",
                line=node.lineno,
                severity="MEDIUM",
                snippet=ast.unparse(node),
                cwe_id="CWE-22",
                owasp_id="A01:2021",
                detection_method="ast_heuristic"
            )
