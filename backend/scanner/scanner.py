import ast
import logging
from typing import List, Dict, Any, Optional, Set

from backend.scanner.analyzer import DataFlowAnalyzer

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
    AST Security Orchestrator. Walks the AST and dispatches nodes to registered modular rules,
    leveraging the DataFlowAnalyzer for source-to-sink taint tracking.
    """
    def __init__(self, dataflow: Optional[DataFlowAnalyzer] = None):
        self.findings: List[Dict[str, Any]] = []
        self.dataflow: Optional[DataFlowAnalyzer] = dataflow

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
    Modular SAST Scan Entry Point.
    Pass 1: Intra-procedural Data-Flow & Taint Propagation Analysis.
    Pass 2: Modular Rule Dispatch & Evidence-Based Finding Generation.
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
            "owasp_id": "N/A",
            "detection_method": "ast_parser"
        }]

    # Pass 1: Data-Flow & Taint Analysis
    dfa = DataFlowAnalyzer()
    dfa.analyze(tree)

    # Pass 2: AST Security Visitor & Rule Evaluation
    visitor = SecurityVisitor(dataflow=dfa)
    visitor.visit(tree)

    # Pass 3: Deterministic Finding Deduplication
    unique_findings: List[Dict[str, Any]] = []
    seen_keys: Set[str] = set()

    for finding in visitor.findings:
        dedup_key = f"{finding.get('type')}:{finding.get('line')}:{finding.get('cwe_id')}"
        if dedup_key not in seen_keys:
            seen_keys.add(dedup_key)
            unique_findings.append(finding)

    return unique_findings
