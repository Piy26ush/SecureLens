import ast
from . import BaseRule

class FlaskDebugRule(BaseRule):
    """
    Rule 10: Detects Flask applications running with debug mode enabled (debug=True).
    """
    def visit_Call(self, node: ast.Call):
        func_name = None
        if isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):
            func_name = node.func.attr
        elif isinstance(node.func, ast.Name):
            func_name = node.func.id

        if func_name == 'run':
            for kw in node.keywords:
                if kw.arg == 'debug':
                    val = kw.value
                    if isinstance(val, ast.Constant) and val.value is True:
                        self.add_finding(
                            type_key="flask_debug",
                            line=node.lineno,
                            severity="MEDIUM",
                            snippet=ast.unparse(node),
                            cwe_id="CWE-489",
                            owasp_id="A05:2021"
                        )

class BareExceptionRule(BaseRule):
    """
    Rule 11: Detects bare except: handlers that suppress all exceptions, hiding system failures.
    """
    def visit_ExceptHandler(self, node: ast.ExceptHandler):
        # If node.type is None, it is a bare except: handler
        if node.type is None:
            self.add_finding(
                type_key="bare_except",
                line=node.lineno,
                severity="LOW",
                snippet=ast.unparse(node).split('\n')[0],  # Get the header line
                cwe_id="CWE-248",
                owasp_id="A05:2021"
            )

class AssertMisuseRule(BaseRule):
    """
    Rule 12: Detects assert statements. Running python with -O disables assertions, bypassing validation.
    """
    def visit_Assert(self, node: ast.Assert):
        self.add_finding(
            type_key="assert_misuse",
            line=node.lineno,
            severity="LOW",
            snippet=ast.unparse(node),
            cwe_id="CWE-703",
            owasp_id="A05:2021"
        )

class NetworkMisconfigRule(BaseRule):
    """
    Rule 13: Detects socket or server binds to all interfaces ('0.0.0.0' or '').
    """
    def visit_Call(self, node: ast.Call):
        func_name = None
        if isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):
            func_name = f"{node.func.value.id}.{node.func.attr}"
        elif isinstance(node.func, ast.Name):
            func_name = node.func.id

        # Flag socket.bind(('0.0.0.0', port)) or similar
        if func_name in ('bind', 'socket.bind', 'run', 'app.run'):
            if node.args:
                arg = node.args[0]
                # socket bind takes a tuple (host, port)
                if isinstance(arg, ast.Tuple) and len(arg.elts) >= 2:
                    host = arg.elts[0]
                    if isinstance(host, ast.Constant) and host.value in ('0.0.0.0', ''):
                        self.add_finding(
                            type_key="network_misconfig",
                            line=node.lineno,
                            severity="LOW",
                            snippet=ast.unparse(node),
                            cwe_id="CWE-668",
                            owasp_id="A05:2021"
                        )
            # Also check keywords (e.g. host='0.0.0.0')
            for kw in node.keywords:
                if kw.arg == 'host':
                    val = kw.value
                    if isinstance(val, ast.Constant) and val.value in ('0.0.0.0', ''):
                        self.add_finding(
                            type_key="network_misconfig",
                            line=node.lineno,
                            severity="LOW",
                            snippet=ast.unparse(node),
                            cwe_id="CWE-668",
                            owasp_id="A05:2021"
                        )
