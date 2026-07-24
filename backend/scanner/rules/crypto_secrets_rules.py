import ast
import re
from . import BaseRule

SECRET_KEYWORDS = re.compile(
    r'.*(api_key|secret|password|passwd|token|access_key|private_key|auth_token|pwd).*', 
    re.IGNORECASE
)

class HardcodedSecretsRule(BaseRule):
    """
    Rule 7: Detects potential hardcoded secrets/passwords/API keys assigned to string literals.
    """
    def visit_Assign(self, node: ast.Assign):
        for target in node.targets:
            if isinstance(target, ast.Name):
                if SECRET_KEYWORDS.match(target.id):
                    # Check if the assigned value is a string constant (excluding empty or too short)
                    if isinstance(node.value, ast.Constant) and isinstance(node.value.value, str):
                        secret_val = node.value.value.strip()
                        if secret_val and len(secret_val) > 4:
                            self.add_finding(
                                type_key="hardcoded_secret",
                                line=node.lineno,
                                severity="HIGH",
                                snippet=f"{target.id} = '********'",  # Mask output
                                cwe_id="CWE-798",
                                owasp_id="A07:2021"
                            )

class WeakCryptoRule(BaseRule):
    """
    Rule 8: Detects usage of broken or weak cryptographic algorithms (MD5, SHA1).
    """
    def visit_Call(self, node: ast.Call):
        func_name = None
        if isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):
            func_name = f"{node.func.value.id}.{node.func.attr}"
        elif isinstance(node.func, ast.Name):
            func_name = node.func.id

        # Flag hashlib.md5(), hashlib.sha1()
        if func_name in ('hashlib.md5', 'hashlib.sha1'):
            self.add_finding(
                type_key="weak_crypto",
                line=node.lineno,
                severity="MEDIUM",
                snippet=ast.unparse(node),
                cwe_id="CWE-327",
                owasp_id="A02:2021"
            )
        # Flag hashlib.new('md5'), hashlib.new('sha1')
        elif func_name == 'hashlib.new':
            if node.args:
                first_arg = node.args[0]
                if isinstance(first_arg, ast.Constant) and str(first_arg.value).lower() in ('md5', 'sha1'):
                    self.add_finding(
                        type_key="weak_crypto",
                        line=node.lineno,
                        severity="MEDIUM",
                        snippet=ast.unparse(node),
                        cwe_id="CWE-327",
                        owasp_id="A02:2021"
                    )

class WeakRandomRule(BaseRule):
    """
    Rule 9: Detects usage of pseudo-random generators (random module) for security-sensitive contexts.
    """
    def visit_Call(self, node: ast.Call):
        func_name = None
        if isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):
            func_name = f"{node.func.value.id}.{node.func.attr}"
        elif isinstance(node.func, ast.Name):
            func_name = node.func.id

        # Check for standard random module generators
        if func_name in ('random.random', 'random.randint', 'random.choice', 'random.randrange', 'random.uniform'):
            self.add_finding(
                type_key="weak_random",
                line=node.lineno,
                severity="MEDIUM",
                snippet=ast.unparse(node),
                cwe_id="CWE-338",
                owasp_id="A02:2021"
            )
