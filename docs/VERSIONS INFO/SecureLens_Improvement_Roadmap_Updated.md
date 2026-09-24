# **SecureLens Improvement Roadmap (v1.0 → v3.0)**

Updated roadmap tracking architecture evolution from basic pattern matching to an enterprise-grade AI-assisted security ecosystem.

---

## **Version 1.0 – Production Ready (MVP)**

* AST deterministic scanner  
* TF-IDF (VSM) retrieval  
* Gemini + Groq fallback  
* FastAPI backend & Pydantic models  
* Centralized config & logging  
* Pipeline orchestration  
* React dashboard with animated pipeline  
* OWASP/CWE references & documentation  

---

## **Version 2.0 – Semantic Vector RAG & Product Polish**

* Sentence Transformer / ONNX MiniLM embeddings  
* Persistent ChromaDB vector store with 60+ OWASP/CWE guidelines  
* Single batched LLM request with strict JSON validation  
* In-memory cache for duplicate explanations  
* 3-Page SaaS Web Platform (`/`, `/features`, `/app`) with 3D WebGL Canvas  
* ReportLab Executive PDF Exporter  
* Official NPM CLI Tool (`npx securelens-ai scan/audit/export`)  

---

## **Version 3.0 – Intermediate-Level SAST Data-Flow & Taint Engine**

* **Intra-procedural Symbol & Scope Model** (`Scope`, `Symbol`, `TaintState`)  
* **Source Registry** (Flask, Django, FastAPI, `sys.argv`, `input()`, `os.environ`)  
* **Sink Registry** (SQL sinks, Command execution, `eval`/`exec`, filesystem I/O)  
* **Sanitizer & Neutralization Boundaries** (Parameterized queries, type casts, quotes)  
* **Local Data-Flow Engine** (Direct flow, aliases, f-strings, binary concatenations)  
* **Reassignment Invalidation** (Clearing taint on safe constant assignments)  
* **Structured Evidence Paths** (`source` → `propagation_path` → `sink` → `sanitizer`)  
* **Hybrid Rule Architecture** (Taint-aware injection rules + structural checkers)  
* **Automated SAST Benchmarks & Test Corpus** (Precision, Recall, F1, 100% test coverage)  

---

## **Version 3.5 – Remediation & AI Patch Verification (Next Milestone)**

* AST-guided Code Patch Generation  
* Side-by-side Git Diff Synthesis  
* Pre-apply Static Re-scan Validation  
* Human Approval Gateways  

---

## **Version 4.0 – Developer Platform & Ecosystem**

* Production VS Code IDE Extension with Inline Squiggles & Quick Fix  
* GitHub Repository URL Direct Remote Scanner  
* User Accounts & Persistent Cloud Audit History (Supabase/PostgreSQL)  
* Multi-Language AST Support (JavaScript / TypeScript / Go)  