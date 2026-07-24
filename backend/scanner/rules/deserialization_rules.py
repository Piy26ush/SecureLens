import ast
from . import BaseRule

class PickleRule(BaseRule):
    """
    Rule 5: Detects unsafe pickle.loads() and pickle.load() deserialization vulnerabilities.
    """
    def visit_Call(self, node: ast.Call):
        func_name = None
        if isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):
            func_name = f"{node.func.value.id}.{node.func.attr}"
        
        if func_name in ('pickle.loads', 'pickle.load', '_pickle.loads', '_pickle.load', 'cPickle.loads', 'cPickle.load'):
            self.add_finding(
                type_key="pickle_loads",
                line=node.lineno,
                severity="CRITICAL",
                snippet=ast.unparse(node),
                cwe_id="CWE-502",
                owasp_id="A08:2021"
            )

class YamlRule(BaseRule):
    """
    Rule 6: Detects unsafe PyYAML loading (yaml.load without safe loader settings).
    """
    def visit_Call(self, node: ast.Call):
        func_name = None
        if isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):
            func_name = f"{node.func.value.id}.{node.func.attr}"

        if func_name in ('yaml.load', 'yaml.load_all'):
            # Check if Loader is SafeLoader
            has_safe_loader = False
            for kw in node.keywords:
                if kw.arg == 'Loader':
                    # e.g., Loader=yaml.SafeLoader or Loader=SafeLoader
                    val = kw.value
                    if isinstance(val, ast.Attribute) and val.attr in ('SafeLoader', 'CSafeLoader'):
                        has_safe_loader = True
                    elif isinstance(val, ast.Name) and val.id in ('SafeLoader', 'CSafeLoader'):
                        has_safe_loader = True
            
            if not has_safe_loader:
                self.add_finding(
                    type_key="unsafe_yaml",
                    line=node.lineno,
                    severity="HIGH",
                    snippet=ast.unparse(node),
                    cwe_id="CWE-502",
                    owasp_id="A08:2021"
                )
