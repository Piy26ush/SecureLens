from enum import Enum
from typing import List, Optional, Dict, Any
from dataclasses import dataclass, field

class TaintState(str, Enum):
    UNTAINTED = "UNTAINTED"
    TAINTED = "TAINTED"
    SANITIZED = "SANITIZED"
    UNKNOWN = "UNKNOWN"

@dataclass
class EvidencePath:
    source: str
    sink: str
    flow: List[str] = field(default_factory=list)
    sanitizer: Optional[str] = None
    analysis_type: str = "taint_dataflow"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "source": self.source,
            "sink": self.sink,
            "flow": self.flow,
            "sanitizer": self.sanitizer,
            "analysis_type": self.analysis_type
        }

@dataclass
class Symbol:
    name: str
    scope_id: str
    state: TaintState = TaintState.UNKNOWN
    source_expr: Optional[str] = None
    source_line: Optional[int] = None
    propagation_path: List[str] = field(default_factory=list)
    is_constant: bool = False
    is_dynamic_expression: bool = False

    def mark_tainted(self, source_expr: str, line: int, step_desc: str = ""):
        self.state = TaintState.TAINTED
        self.source_expr = source_expr
        self.source_line = line
        self.is_constant = False
        if step_desc:
            self.propagation_path.append(step_desc)

    def mark_untainted(self, step_desc: str = "", is_constant: bool = True):
        self.state = TaintState.UNTAINTED
        self.source_expr = None
        self.source_line = None
        self.is_constant = is_constant
        self.is_dynamic_expression = False
        self.propagation_path = []

    def mark_sanitized(self, sanitizer_name: str, step_desc: str = ""):
        self.state = TaintState.SANITIZED
        if step_desc:
            self.propagation_path.append(f"Sanitized with {sanitizer_name}: {step_desc}")

    def alias_from(self, parent_symbol: "Symbol", step_desc: str):
        self.state = parent_symbol.state
        self.source_expr = parent_symbol.source_expr
        self.source_line = parent_symbol.source_line
        self.is_constant = parent_symbol.is_constant
        self.is_dynamic_expression = parent_symbol.is_dynamic_expression
        self.propagation_path = list(parent_symbol.propagation_path)
        if step_desc:
            self.propagation_path.append(step_desc)

class Scope:
    def __init__(self, scope_id: str, name: str, parent: Optional["Scope"] = None):
        self.scope_id = scope_id
        self.name = name
        self.parent = parent
        self.symbols: Dict[str, Symbol] = {}

    def get_symbol(self, name: str) -> Optional[Symbol]:
        if name in self.symbols:
            return self.symbols[name]
        if self.parent:
            return self.parent.get_symbol(name)
        return None

    def set_symbol(self, symbol: Symbol):
        self.symbols[symbol.name] = symbol
