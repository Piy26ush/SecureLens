import ast
from typing import List, Dict, Any, Set

class BaseRule:
    """
    Base class for all modular AST security scanner rules.
    """
    def __init__(self, visitor):
        self.visitor = visitor

    def add_finding(self, type_key: str, line: int, severity: str, snippet: str, cwe_id: str, owasp_id: str):
        """
        Helper method to register a security finding.
        """
        self.visitor.findings.append({
            "type": type_key,
            "line": line,
            "severity": severity,
            "snippet": snippet,
            "cwe_id": cwe_id,
            "owasp_id": owasp_id
        })

    def visit_Assign(self, node: ast.Assign):
        pass

    def visit_Call(self, node: ast.Call):
        pass

    def visit_ExceptHandler(self, node: ast.ExceptHandler):
        pass

    def visit_Assert(self, node: ast.Assert):
        pass
