import ast
import re
from typing import List, Dict, Any

# Regular expression to identify variables that likely store sensitive secrets
SECRET_KEYWORDS = re.compile(
    r'.*(api_key|secret|password|passwd|token|access_key|private_key|auth_token|pwd).*', 
    re.IGNORECASE
)

class SecurityVisitor(ast.NodeVisitor):
    """
    AST Visitor that walks the parsed code tree and detects standard 
    dangerous patterns (deterministic security analysis).
    """
    def __init__(self):
        self.findings: List[Dict[str, Any]] = []
        # Keep track of local variables assigned to dynamic string constructions
        self.dynamic_variables = set()

    def visit_Assign(self, node: ast.Assign):
        # Basic Dataflow Analysis: Track variables assigned to dynamic string operations
        val = node.value
        is_dynamic_val = False
        
        # Flag f-strings
        if isinstance(val, ast.JoinedStr):
            is_dynamic_val = True
        # Flag string operations (concatenations or % formatting)
        elif isinstance(val, ast.BinOp):
            is_dynamic_val = True
        # Flag format() calls
        elif (isinstance(val, ast.Call) and 
              isinstance(val.func, ast.Attribute) and 
              val.func.attr == 'format'):
            is_dynamic_val = True

        if is_dynamic_val:
            for target in node.targets:
                if isinstance(target, ast.Name):
                    self.dynamic_variables.add(target.id)

        # Detect Hardcoded Secrets
        for target in node.targets:
            if isinstance(target, ast.Name):
                if SECRET_KEYWORDS.match(target.id):
                    # Check if the assigned value is a string constant (excluding empty or too short)
                    if isinstance(node.value, ast.Constant) and isinstance(node.value.value, str):
                        secret_val = node.value.value.strip()
                        if secret_val and len(secret_val) > 4:
                            self.findings.append({
                                "type": "hardcoded_secret",
                                "line": node.lineno,
                                "severity": "HIGH",
                                "snippet": f"{target.id} = '********'", # mask output in snippet
                                "cwe_id": "CWE-798",
                                "owasp_id": "A07:2021"
                            })
        self.generic_visit(node)

    def visit_Call(self, node: ast.Call):
        # 1. Detect eval() and exec() calls
        if isinstance(node.func, ast.Name) and node.func.id in ('eval', 'exec'):
            self.findings.append({
                "type": "eval_exec",
                "line": node.lineno,
                "severity": "CRITICAL",
                "snippet": ast.unparse(node),
                "cwe_id": "CWE-95",
                "owasp_id": "A03:2021"
            })

        # 2. Detect pickle.loads() deserialization vulnerability
        elif (isinstance(node.func, ast.Attribute) and 
              node.func.attr == 'loads' and 
              isinstance(node.func.value, ast.Name) and 
              node.func.value.id == 'pickle'):
            self.findings.append({
                "type": "pickle_loads",
                "line": node.lineno,
                "severity": "CRITICAL",
                "snippet": ast.unparse(node),
                "cwe_id": "CWE-502",
                "owasp_id": "A08:2021"
            })

        # 3. Detect Command Injections (os.system, subprocess.run, etc.) with dynamic args
        else:
            func_name = None
            if isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):
                func_name = f"{node.func.value.id}.{node.func.attr}"
            elif isinstance(node.func, ast.Name):
                func_name = node.func.id

            if func_name in ('os.system', 'subprocess.run', 'subprocess.Popen', 'subprocess.call', 'os.popen'):
                if node.args:
                    first_arg = node.args[0]
                    # If the command argument is a string literal (Constant), it's safe.
                    # If it uses variable concatenation, f-strings, or dynamic variable tracker, it's flagged.
                    is_safe = isinstance(first_arg, ast.Constant) and isinstance(first_arg.value, str)
                    
                    # Also check if it uses a dynamic variable we are tracking
                    is_dangerous = False
                    if isinstance(first_arg, ast.Name) and first_arg.id in self.dynamic_variables:
                        is_dangerous = True
                        
                    if is_dangerous or not is_safe:
                        self.findings.append({
                            "type": "command_injection",
                            "line": node.lineno,
                            "severity": "HIGH",
                            "snippet": ast.unparse(node),
                            "cwe_id": "CWE-78",
                            "owasp_id": "A03:2021"
                        })

            # 4. Detect SQL Injection in execution commands (cursor.execute, raw, etc.)
            elif isinstance(node.func, ast.Attribute) and node.func.attr in ('execute', 'raw'):
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
                    elif isinstance(first_arg, ast.Name) and first_arg.id in self.dynamic_variables:
                        is_dynamic = True

                    if is_dynamic:
                        self.findings.append({
                            "type": "sql_injection",
                            "line": node.lineno,
                            "severity": "HIGH",
                            "snippet": ast.unparse(node),
                            "cwe_id": "CWE-89",
                            "owasp_id": "A03:2021"
                        })

            # 5. Detect Path Traversal (dynamic inputs to open() calls)
            elif isinstance(node.func, ast.Name) and node.func.id == 'open':
                if node.args:
                    first_arg = node.args[0]
                    # If the file path is built dynamically via string formatting or f-strings
                    is_dynamic_path = False
                    if isinstance(first_arg, (ast.JoinedStr, ast.BinOp)):
                        is_dynamic_path = True
                    elif isinstance(first_arg, ast.Name) and first_arg.id in self.dynamic_variables:
                        is_dynamic_path = True
                        
                    if is_dynamic_path:
                        self.findings.append({
                            "type": "path_traversal",
                            "line": node.lineno,
                            "severity": "MEDIUM",
                            "snippet": ast.unparse(node),
                            "cwe_id": "CWE-22",
                            "owasp_id": "A01:2021"
                        })

        self.generic_visit(node)

def scan_code_ast(code: str) -> List[Dict[str, Any]]:
    """
    Parses source code into an AST and visits each node to detect vulnerabilities.
    """
    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        return [{
            "type": "syntax_error",
            "line": e.lineno or 0,
            "severity": "LOW",
            "snippet": f"Syntax Error: {e.msg}",
            "cwe_id": "CWE-684",
            "owasp_id": "N/A"
        }]

    visitor = SecurityVisitor()
    visitor.visit(tree)
    return visitor.findings
