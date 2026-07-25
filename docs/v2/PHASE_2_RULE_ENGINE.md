# Version 2 — Phase 2: Modular AST Rule Engine

> **Status**: **[COMPLETED]**  
> **Key Architecture Upgrade**: Refactored the unified static scanner into a modular, decoupled rule engine (`backend/scanner/rules/`) with 13 custom security detectors mapping to CWEs and OWASP standards.

---

## 🎯 Engineering Goals & Motivation

### Why did we make this change?
In Version 1, the AST scanner was written as a single visitor class (`SecurityVisitor`) inside a single file (`backend/scanner/rules.py`). While this worked for a simple proof-of-concept, it posed major engineering drawbacks:
1. **Low Maintainability**: Adding, modifying, or disabling a detector required editing a massive, monolithic class.
2. **Lack of Extensibility**: Adding new vulnerability types polluted the main file and increased risk of breaking existing rules.
3. **No Separation of Concerns**: Testing a single rule required executing the entire AST visitor, making unit testing fragile and highly coupled.

### The Solution: Decoupled Registry Pattern
In Version 2 Phase 2, we refactored the scanner into a **Decoupled Registry Pattern**:
- **Unified Base Class (`BaseRule`)**: Defines a clean interface for rules to tap into standard AST node hook visits (`visit_Call`, `visit_Assign`, `visit_ExceptHandler`, `visit_Assert`) and register findings.
- **Rules Registry**: The main orchestrator (`SecurityVisitor`) acts as a registry, iterating through a list of rule subclasses and dispatching node visits dynamically.
- **Categorized Rule Modules**: Decoupled rules are grouped logically in separate Python modules under the `backend/scanner/rules/` directory:
  - `injection_rules.py` (SQLi, Command Injection, Path Traversal, Code Execution)
  - `deserialization_rules.py` (Unsafe Pickle and PyYAML loaders)
  - `crypto_secrets_rules.py` (Hardcoded API keys, weak algorithms, pseudo-randomness)
  - `framework_quality_rules.py` (Flask debug, bare except blocks, asserts, binding configurations)

---

## 🏗️ Decoupled Folder Structure

```text
backend/scanner/
├── rules.py                    # AST Dispatch Orchestrator (Generic Node Visitor)
└── rules/
    ├── __init__.py             # Unified BaseRule class interface
    ├── injection_rules.py      # Code/SQL/Command Injection & Path Traversal detectors
    ├── deserialization_rules.py# Unsafe serialization detectors (Pickle & YAML)
    ├── crypto_secrets_rules.py # Cryptographic & secrets detectors
    └── framework_quality_rules.py # Configuration & quality detectors
```

---

## 📈 Architecture Workflow Diagram

The flowchart below demonstrates how AST node traversal, state tracking (dataflow), and modular rule evaluation decouple parsing logic from target rule validation checks:

![Phase 2 Rule Engine Architecture](file:///Users/piyush/Desktop/SecureLens/docs/v2_phase2_architecture.png)

---

## 🔧 Vulnerability Rules Specification

| Detector | Rule Name | Description | Severity | CWE | OWASP |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `eval_exec` | Detects arbitrary code execution calls | CRITICAL | CWE-95 | A03:2021 |
| **2** | `sql_injection` | Detects dynamic string concatenations in database execution calls | HIGH | CWE-89 | A03:2021 |
| **3** | `command_injection` | Detects unsanitized input to system shells (e.g. `subprocess.run(shell=True)`) | HIGH | CWE-78 | A03:2021 |
| **4** | `path_traversal` | Detects dynamic variables passed into `open()` file handlers | MEDIUM | CWE-22 | A01:2021 |
| **5** | `pickle_loads` | Detects unsafe deserialization of untrusted binary data | CRITICAL | CWE-502 | A08:2021 |
| **6** | `unsafe_yaml` | Detects unsafe loading in PyYAML without `SafeLoader` | HIGH | CWE-502 | A08:2021 |
| **7** | `hardcoded_secret` | Detects passwords, API keys, or access tokens stored in plaintext | HIGH | CWE-798 | A07:2021 |
| **8** | `weak_crypto` | Detects broken hash functions (MD5, SHA1) in `hashlib` | MEDIUM | CWE-327 | A02:2021 |
| **9** | `weak_random` | Detects pseudo-random generators (`random` module) for security tasks | MEDIUM | CWE-338 | A02:2021 |
| **10** | `flask_debug` | Detects web apps started with `debug=True` in production | MEDIUM | CWE-489 | A05:2021 |
| **11** | `bare_except` | Detects empty exception handlers suppressing critical system exits | LOW | CWE-248 | A05:2021 |
| **12** | `assert_misuse` | Detects validations that can be bypassed when run with `-O` flag | LOW | CWE-703 | A05:2021 |
| **13** | `network_misconfig` | Detects server binds to all interfaces (`0.0.0.0`) | LOW | CWE-668 | A05:2021 |

---

## 🧪 How to Verify

1. Run the local static scanner verification suite:
   ```bash
   python3 test_scanner.py
   ```
2. The scanner will run against 13 distinct target vulnerability patterns, verify AST node traversal, and output structured finding counts.
