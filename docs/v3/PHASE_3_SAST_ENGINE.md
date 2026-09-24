# Version 3.0 — Intermediate-Level SAST Data-Flow & Taint Analysis Engine

> **Status**: In Development  
> **Key Architecture Upgrade**: Evolving SecureLens from an AST pattern-matching scanner into an **explainable, intermediate-level Static Application Security Testing (SAST) engine** equipped with intra-procedural symbol tracking, local data-flow analysis, source-to-sink taint propagation, and evidence-based finding generation.

---

## 🎯 Motivation & Engineering Goals

### Limitations of Version 2.0 (AST Pattern Matcher)
In Version 2.0, the scanner used a modular AST visitor with a flat `dynamic_variables` set. While effective as a quick baseline, it suffered from fundamental data-flow limitations:
1. **No Source Provenance**: It could not differentiate whether dynamic data originated from an untrusted web source (`request.args`) or an internal trusted string concatenation (`"PREFIX_" + "CONSTANT"`).
2. **No Multi-Hop Alias Propagation**: Aliased variables (`a = request.args['id']; b = a; query = b`) were lost across multiple assignment steps.
3. **No Reassignment Invalidation**: Reassigning a variable to a safe constant (`x = request.args; x = "safe_value"`) did not clear taint state, causing false positives.
4. **Scope Ignorance**: Variables shared the same name across different functions collided in a single flat set.
5. **No Structured Evidence**: Findings reported only the line of the sink, without explaining *how* untrusted data reached the sink.

---

## 🏛️ Target Architecture (V3.0 SAST Pipeline)

```text
Python Source Code
     │
     ▼
AST (ast.parse)
     │
     ▼
Intra-Procedural Scope & Symbol Table (ScopeEnvironment)
     │
     ▼
Source Identification (SourceRegistry: request.args, sys.argv, input(), etc.)
     │
     ▼
Local Data-Flow & Taint Propagation (DataFlowAnalyzer)
     │   ├── Direct Assignment (x = source)
     │   ├── Alias Propagation (y = x)
     │   ├── Expression Building (f-strings, BinOp "+", .format())
     │   └── Reassignment Invalidation (x = "constant" -> UNTAINTED)
     ▼
Sink & Sanitizer Evaluation (SinkRegistry + SanitizerRegistry)
     │   ├── Parameterized query verification (cursor.execute(sql, params))
     │   ├── Cast / Quote sanitizers (int(x), shlex.quote(x))
     │   └── Source -> Flow -> Sink evidence path construction
     ▼
Modular Security Rules (SqlInjectionRule, CommandInjectionRule, PathTraversalRule)
     │
     ▼
Evidence-Based Finding (with source, flow trace, sink, analysis_type)
     │
     ▼
RAG Vector Store & LLM Explanation Synthesis
```

---

## 📦 Core SAST Subsystems (`backend/scanner/analyzer/`)

```text
backend/scanner/
├── analyzer/
│   ├── __init__.py           # Subsystem entry points
│   ├── symbols.py            # Scope, Symbol, TaintState, and EvidencePath models
│   ├── sources.py            # SourceRegistry (Flask, Django, CLI, environment inputs)
│   ├── sinks.py              # SinkRegistry (SQL, Command, File, Code execution sinks)
│   ├── sanitizers.py         # SanitizerRegistry (Parameterized queries, type casts, quotes)
│   └── dataflow.py           # DataFlowAnalyzer (AST intra-procedural propagation engine)
├── rules/                    # Modular rule detectors (Structural + Taint-aware)
├── scanner.py                # Scanner orchestrator executing DataFlowAnalyzer + Rules
└── pipeline.py               # RAG context enrichment & LLM cascade
```

---

## 🔍 Detailed Component Specifications

### 1. Symbol & Taint State (`symbols.py`)
- **`TaintState` Enum**:
  - `TAINTED`: Holds data directly from or derived from an untrusted source.
  - `UNTAINTED`: Known constant or explicitly sanitized value.
  - `UNKNOWN`: Variable with unresolved origin (evaluated conservatively).
- **`Symbol`**:
  - `name`: Identifier name (e.g. `query`, `user_id`).
  - `scope_id`: Unique ID of the enclosing function or module block.
  - `state`: Current `TaintState`.
  - `source_expr`: String representation of origin (e.g. `request.args['id']`).
  - `source_line`: Line number where taint was introduced.
  - `propagation_path`: Chronological list of intermediate variable transformations (`["user = request.args['id']", "x = user", "query = ... + x"]`).

### 2. Source Registry (`sources.py`)
Identifies untrusted entry points into the Python program:
- **Web Frameworks (Flask / Django / FastAPI)**:
  - `request.args`, `request.form`, `request.values`, `request.json`, `request.get_json()`
  - `request.headers`, `request.cookies`, `request.data`, `request.GET`, `request.POST`
- **Standard Library / CLI**:
  - `input()`, `sys.argv`, `os.environ.get()`, `os.getenv()`

### 3. Sink Registry (`sinks.py`)
Identifies dangerous operations and parameter positions:
- **SQL Execution**: `cursor.execute()`, `connection.execute()`, `session.execute()`, `raw()`
- **Command Execution**: `os.system()`, `os.popen()`, `subprocess.run()`, `subprocess.Popen()`, `subprocess.call()`
- **Code Execution**: `eval()`, `exec()`
- **File System**: `open()`

### 4. Sanitizer & Boundary Registry (`sanitizers.py`)
Vulnerability-specific neutralizing checks:
- **SQL**: Multi-argument parameterized queries (e.g. `cursor.execute(sql, (param1, param2))`).
- **Command**: `shlex.quote()`, `shlex.split()`, `subprocess.run(list_of_args, shell=False)`.
- **Type Coercion**: `int(x)`, `float(x)`, `bool(x)`.

---

## 🧪 Reference Implementation: SQL Injection Test Matrix

| Case ID | Code Pattern | Expected Outcome | Rationale |
| :--- | :--- | :--- | :--- |
| **Case A** | `u = request.args['id']`<br>`cursor.execute("SELECT * FROM u WHERE id=" + u)` | 🚨 **FINDING** | Direct untrusted flow into SQL sink |
| **Case B** | `u = request.args['id']`<br>`x = u`<br>`cursor.execute("SELECT * FROM u WHERE id=" + x)` | 🚨 **FINDING** | Single-hop alias propagation |
| **Case C** | `u = request.args['id']`<br>`x = u`<br>`q = "SELECT ... WHERE id=" + x`<br>`cursor.execute(q)` | 🚨 **FINDING (Full Evidence)** | Multi-step expression propagation with trace |
| **Case D** | `u = request.args['id']`<br>`q = f"SELECT ... WHERE id={u}"`<br>`cursor.execute(q)` | 🚨 **FINDING** | F-string interpolation with tainted symbol |
| **Case E** | `u = request.args['id']`<br>`cursor.execute("SELECT ... WHERE id=?", (u,))` | ✅ **SAFE (No Finding)** | Parameterized query boundary neutralizes SQLi |
| **Case F** | `q = "SELECT * FROM users WHERE active=1"`<br>`cursor.execute(q)` | ✅ **SAFE (No Finding)** | Pure constant string query |
| **Case G** | `u = request.args['id']`<br>`u = "default_user"`<br>`cursor.execute("SELECT " + u)` | ✅ **SAFE (No Finding)** | Reassignment overwrites taint to constant |

---

## 📊 Evidence-Based Finding Schema

```json
{
  "type": "sql_injection",
  "line": 18,
  "severity": "HIGH",
  "snippet": "cursor.execute(query)",
  "cwe_id": "CWE-89",
  "owasp_id": "A03:2021",
  "detection_method": "taint_dataflow",
  "evidence": {
    "source": "request.args['username'] (line 12)",
    "sink": "cursor.execute(query) (line 18)",
    "propagation_path": [
      "username = request.args['username'] (line 12)",
      "x = username (line 14)",
      "query = 'SELECT * FROM users WHERE name=' + x (line 16)"
    ],
    "sanitizer_applied": null
  }
}
```
