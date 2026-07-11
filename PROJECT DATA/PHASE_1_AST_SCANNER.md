# Phase 1: Setup & AST Scanner Explanation

This document contains the detailed explanation of what we built in Phase 1, why we built it, and the technical concepts behind it.

---

## 1. Project Directory Structure
To make our application modular and scalable, we organized the directories as follows:
```text
securelens/
├── backend/
│   ├── main.py             # FastAPI entrypoint and API routes
│   ├── scanner/
│   │   ├── __init__.py
│   │   └── rules.py        # Abstract Syntax Tree (AST) pattern rules
│   └── rag/
│       └── retriever.py    # Vector database retriever
├── tests/
│   └── test_scanner.py     # Scanner test suite running with unittest
```
*   **Why?**: Decoupling the routes (`main.py`) from the scanning patterns (`rules.py`) ensures that we can change the API framework or add a CLI wrapper without affecting our core scanning engine.

---

## 2. What is an AST (Abstract Syntax Tree)?
When Python executes code, it first parses it into an **Abstract Syntax Tree (AST)**—a structured, hierarchical tree diagram where each node represents a code construct (variables, functions, operations, etc.).

For example, the code `x = 5 + 3` becomes an AST tree structure:
*   `Assign` (Assignment statement node)
    *   Target: `Name(id='x')`
    *   Value: `BinOp` (Binary operation node)
        *   Left: `Constant(value=5)`
        *   Op: `Add`
        *   Right: `Constant(value=3)`

---

## 3. Why use an AST Scanner?
Large Language Models (LLMs) are great at explaining things, but they suffer from **hallucinations** and are **slow/expensive** to call for every simple check. 

An **AST Scanner** runs locally, takes milliseconds, and is **100% deterministic** (meaning it will find exactly the same issues every time with zero guessing). We walk through the tree using Python's native `ast` module to look for unsafe nodes like:
*   Calling `os.system()` with variables (Command Injection).
*   Calling `cursor.execute()` with string formatting instead of parameterized queries (SQL Injection).
*   Using `eval()` or `exec()`.
*   Deserializing untrusted data with `pickle.loads()`.
*   Hardcoding secrets (e.g. variables named `api_key` or `password` holding constant strings).

---

## 4. Advanced Concept: Dataflow Analysis
During unit testing, we encountered a classic static analysis challenge:
```python
# A query is constructed in statement 1:
query = f"SELECT * FROM users WHERE name = '{name}'"

# The query is executed in statement 2:
cursor.execute(query)
```
If our AST visitor only inspected the arguments of the execution node (`cursor.execute`), it would only see `query` (a variable name) and think it's a safe query parameter.

To solve this, we implemented **Basic Dataflow Analysis**:
1.  When walking the tree, if the scanner encounters an assignment statement (`visit_Assign`), it checks if the value on the right-side is a dynamic string (concatenated or f-string).
2.  If it is, it adds the variable name to a `dynamic_variables` tracking set.
3.  When it later visits a call statement (`visit_Call`) for `cursor.execute()`, it checks if the query argument matches any variable inside the `dynamic_variables` set. If it does, it flags it as a vulnerability!

---

## 5. Verification Results
We verified our AST scanner using Python's built-in `unittest` framework to verify 9 distinct test cases:
*   Critical: `eval`/`exec` calls & `pickle` deserialization.
*   High: Dynamic command arguments & SQL injection (both inline and variable-based).
*   Medium: Dynamic file paths (Path Traversal).
*   Correct Casing: Confirming that safe static SQL statements or shell commands raise zero warnings.
*   Errors: Checking code with syntax errors returns gracefully.

All tests ran successfully with `OK` status!
