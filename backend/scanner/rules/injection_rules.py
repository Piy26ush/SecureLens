import ast
from . import BaseRule

class EvalExecRule(BaseRule):
    """
    Rule 1: Detects dangerous usage of eval() and exec() which allow arbitrary code execution.
    """
    def visit_Call(self, node: ast.Call):
        if isinstance(node.func, ast.Name) and node.func.id in ('eval', 'exec'):
            self.add_finding(
                type_key="eval_exec",
                line=node.lineno,
                severity="CRITICAL",
                snippet=ast.unparse(node),
                cwe_id="CWE-95",
                owasp_id="A03:2021"
            )

class SqlInjectionRule(BaseRule):
    """
    Rule 2: Detects SQL Injection in execution commands (cursor.execute, raw, etc.) when dynamic queries are used.
    """
    def visit_Call(self, node: ast.Call):
        if isinstance(node.func, ast.Attribute) and node.func.attr in ('execute', 'raw'):
            if node.args:
                first_arg = node.args[0]
                is_dynamic = False
                
                # Flag f-strings
                if isinstance(first_arg, ast.JoinedStr):
                    is_dynamic = True
                # Flag string operations (concatenations or % formatting)
                elif isinstance(first_arg, ast.BinOp):
                    is_dynamic = True
                # Flag format() calls: e.g. "SELECT ...".format(val)
                elif (isinstance(first_arg, ast.Call) and 
                      isinstance(first_arg.func, ast.Attribute) and 
                      first_arg.func.attr == 'format'):
                    is_dynamic = True
                # Flag tracked variables assigned dynamically
                elif isinstance(first_arg, ast.Name) and first_arg.id in self.visitor.dynamic_variables:
                    is_dynamic = True

                if is_dynamic:
                    self.add_finding(
                        type_key="sql_injection",
                        line=node.lineno,
                        severity="HIGH",
                        snippet=ast.unparse(node),
                        cwe_id="CWE-89",
                        owasp_id="A03:2021"
                    )

class CommandInjectionRule(BaseRule):
    """
    Rule 3: Detects Command Injection (os.system, subprocess.run, os.popen, etc.) with dynamic arguments.
    """
    def visit_Call(self, node: ast.Call):
        func_name = None
        if isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):
            func_name = f"{node.func.value.id}.{node.func.attr}"
        elif isinstance(node.func, ast.Name):
            func_name = node.func.id

        if func_name in ('os.system', 'subprocess.run', 'subprocess.Popen', 'subprocess.call', 'os.popen'):
            if node.args:
                first_arg = node.args[0]
                
                # If command argument is a string literal (Constant), it's safe.
                is_safe = isinstance(first_arg, ast.Constant) and isinstance(first_arg.value, str)
                
                # Also check if it uses a dynamic variable we are tracking
                is_dangerous = False
                if isinstance(first_arg, ast.Name) and first_arg.id in self.visitor.dynamic_variables:
                    is_dangerous = True
                elif isinstance(first_arg, (ast.JoinedStr, ast.BinOp)):
                    is_dangerous = True
                    
                if is_dangerous or not is_safe:
                    self.add_finding(
                        type_key="command_injection",
                        line=node.lineno,
                        severity="HIGH",
                        snippet=ast.unparse(node),
                        cwe_id="CWE-78",
                        owasp_id="A03:2021"
                    )

class PathTraversalRule(BaseRule):
    """
    Rule 4: Detects Path Traversal vulnerabilities when file paths are dynamically built in open() calls.
    """
    def visit_Call(self, node: ast.Call):
        if isinstance(node.func, ast.Name) and node.func.id == 'open':
            if node.args:
                first_arg = node.args[0]
                is_dynamic_path = False
                if isinstance(first_arg, (ast.JoinedStr, ast.BinOp)):
                    is_dynamic_path = True
                elif isinstance(first_arg, ast.Name) and first_arg.id in self.visitor.dynamic_variables:
                    is_dynamic_path = True
                    
                if is_dynamic_path:
                    self.add_finding(
                        type_key="path_traversal",
                        line=node.lineno,
                        severity="MEDIUM",
                        snippet=ast.unparse(node),
                        cwe_id="CWE-22",
                        owasp_id="A01:2021"
                    )
