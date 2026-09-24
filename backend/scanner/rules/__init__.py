import ast
from typing import List, Dict, Any, Set, Optional

class BaseRule:
    """
    Base class for all modular AST security scanner rules.
    """
    def __init__(self, visitor):
        self.visitor = visitor

    def add_finding(
        self, 
        type_key: str, 
        line: int, 
        severity: str, 
        snippet: str, 
        cwe_id: str, 
        owasp_id: str,
        evidence: Optional[Dict[str, Any]] = None,
        detection_method: str = "ast_structural"
    ):
        """
        Helper method to register a security finding with optional SAST evidence metadata.
        """
        finding = {
            "type": type_key,
            "line": line,
            "severity": severity,
            "snippet": snippet,
            "cwe_id": cwe_id,
            "owasp_id": owasp_id,
            "detection_method": detection_method
        }
        if evidence:
            finding["evidence"] = evidence

        self.visitor.findings.append(finding)

    def visit_Assign(self, node: ast.Assign):
        pass

    def visit_Call(self, node: ast.Call):
        pass

    def visit_ExceptHandler(self, node: ast.ExceptHandler):
        pass

    def visit_Assert(self, node: ast.Assert):
        pass
