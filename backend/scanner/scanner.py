import ast
import logging
from typing import List, Dict, Any

# Import modular rules
from backend.scanner.rules.injection_rules import (
    EvalExecRule,
    SqlInjectionRule,
    CommandInjectionRule,
    PathTraversalRule
)
from backend.scanner.rules.deserialization_rules import (
    PickleRule,
    YamlRule
)
from backend.scanner.rules.crypto_secrets_rules import (
    HardcodedSecretsRule,
    WeakCryptoRule,
    WeakRandomRule
)
from backend.scanner.rules.framework_quality_rules import (
    FlaskDebugRule,
    BareExceptionRule,
    AssertMisuseRule,
    NetworkMisconfigRule
)

logger = logging.getLogger("securelens.scanner")

class SecurityVisitor(ast.NodeVisitor):
    """
    AST Security Orchestrator. Walks the AST and dispatches nodes to registered modular rules.
    """
    def __init__(self):
        self.findings: List[Dict[str, Any]] = []
        # Local variables tracking string operations for SQLi / Command injection dataflow checks
        self.dynamic_variables = set()

        # Initialize and register modular rule detectors
        self.rules = [
            EvalExecRule(self),
            SqlInjectionRule(self),
            CommandInjectionRule(self),
            PathTraversalRule(self),
            PickleRule(self),
            YamlRule(self),
            HardcodedSecretsRule(self),
            WeakCryptoRule(self),
            WeakRandomRule(self),
            FlaskDebugRule(self),
            BareExceptionRule(self),
            AssertMisuseRule(self),
            NetworkMisconfigRule(self)
        ]

    def visit_Assign(self, node: ast.Assign):
        # Dataflow tracking: flag variables holding dynamically built strings (concatenation, formatting, f-strings)
        val = node.value
        is_dynamic_val = False
        
        if isinstance(val, ast.JoinedStr):
            is_dynamic_val = True
        elif isinstance(val, ast.BinOp):
            is_dynamic_val = True
        elif (isinstance(val, ast.Call) and 
              isinstance(val.func, ast.Attribute) and 
              val.func.attr == 'format'):
            is_dynamic_val = True

        if is_dynamic_val:
            for target in node.targets:
                if isinstance(target, ast.Name):
                    self.dynamic_variables.add(target.id)

        # Dispatch node to all registered rules
        for rule in self.rules:
            rule.visit_Assign(node)
        self.generic_visit(node)

    def visit_Call(self, node: ast.Call):
        for rule in self.rules:
            rule.visit_Call(node)
        self.generic_visit(node)

    def visit_ExceptHandler(self, node: ast.ExceptHandler):
        for rule in self.rules:
            rule.visit_ExceptHandler(node)
        self.generic_visit(node)

    def visit_Assert(self, node: ast.Assert):
        for rule in self.rules:
            rule.visit_Assert(node)
        self.generic_visit(node)

def scan_code_ast(code: str) -> List[Dict[str, Any]]:
    """
    Modular AST Scan Entry Point. Parses code and executes security checks.
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
