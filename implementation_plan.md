# SecureLens V2.0 — Implementation Plan

> A phased production roadmap to elevate SecureLens from MVP to a full AI-assisted security audit platform.

---

## 🧠 My POV

Your roadmap is **solid and well-structured**, but executing all 24 points at once will stall progress. Here is my recommended approach: **ship in 4 focused phases**, each independently deployable and resume-demonstrable.

The biggest ROI improvements are:
1. **Semantic RAG** (ChromaDB + Gemini Embeddings) — replaces TF-IDF, biggest quality jump
2. **Modular Rule Engine** (20+ AST rules) — the core technical depth of the tool
3. **Project Scanner** — transforms a toy demo into a real engineering tool
4. **PDF/JSON Export** — the feature that turns a dashboard into a deliverable

---

## Phase 1 — Semantic Backend Upgrade
> **Goal**: Replace TF-IDF with real vector search. This is the single highest-impact change.

### Backend changes
| What | Why |
|---|---|
| `backend/rag/embedding.py` | Call Gemini `text-embedding-004` model to embed queries and documents |
| `backend/rag/chroma_store.py` | Replace in-memory VSM with ChromaDB with persistence |
| `backend/rag/build_database.py` | One-shot script to embed + store entire OWASP/CWE knowledge base |
| `backend/rag/retrieve.py` | Async Top-K retrieval by cosine similarity via Chroma |
| `backend/config.py` | Centralise all keys, Top-K, timeout, model names, thresholds |

### Knowledge base
- Expand to 60+ curated OWASP Top 10 + CWE entries with rich metadata (title, severity, rule reference, remediation snippet)

> [!IMPORTANT]
> ChromaDB requires persistent disk storage. On Render, configure a **Persistent Disk** (1GB free tier) so embeddings survive redeployments.

---

## Phase 2 — AST Scanner Expansion
> **Goal**: Go from ~8 rules to 20–25. This is what makes the scanner technically impressive.

### Modular rule engine structure
```
scanner/
├── scanner.py          # Orchestrator: walks AST, calls each rule
└── rules/
    ├── eval_rule.py
    ├── sql_rule.py
    ├── command_injection_rule.py
    ├── path_traversal_rule.py
    ├── pickle_rule.py
    ├── yaml_rule.py
    ├── weak_crypto_rule.py
    ├── hardcoded_secrets_rule.py
    ├── flask_debug_rule.py
    ├── assert_misuse_rule.py
    ├── bare_exception_rule.py
    ├── weak_random_rule.py
    └── network_misconfig_rule.py
```

### Priority rule order
1. `eval()` / `exec()` — Code execution (CRITICAL)
2. SQL string concat — SQL Injection (CRITICAL)
3. `subprocess` shell=True — Command Injection (HIGH)
4. `os.path.join` + user input — Path Traversal (HIGH)
5. `pickle.loads` / `yaml.load` — Unsafe Deserialization (HIGH)
6. Hardcoded passwords/tokens — Hardcoded Secrets (HIGH)
7. `MD5` / `SHA1` — Weak Crypto (MEDIUM)
8. `random.random()` — Weak Randomness (MEDIUM)
9. `app.run(debug=True)` — Flask Debug Mode (MEDIUM)
10. Bare `except:` — Exception Misuse (LOW)

---

## Phase 3 — Project Scanner + Rich Reports
> **Goal**: Scan whole Python projects, not just pastes.

### New API endpoints
```
POST /scan          # Existing single-file scan
POST /scan-project  # NEW: accepts zip/folder, recursive scan
POST /export        # NEW: returns PDF or JSON report
GET  /stats         # NEW: session statistics
GET  /models        # NEW: which Gemini model is in use
GET  /health        # Already exists, formalise it
```

### Pydantic models to add
```python
class ProjectSummary(BaseModel):
    files_scanned: int
    lines_scanned: int
    total_findings: int
    severity_distribution: dict[str, int]
    duration_ms: float
    owasp_coverage: list[str]

class Citation(BaseModel):
    source: str
    url: str
    cwe: str | None
    owasp: str | None
```

### Report structure
- Risk Score (0–100)
- Executive Summary paragraph (LLM-generated)
- Severity Distribution chart data
- OWASP categories covered
- CWE reference links
- Per-finding: file, line, severity, snippet, explanation, fix

---

## Phase 4 — Dashboard UI + Export
> **Goal**: Give recruiters something to click on.

### Frontend additions
| Component | What it does |
|---|---|
| `ProjectUpload.tsx` | Drag-and-drop ZIP upload, triggers `/scan-project` |
| `SeverityChart.tsx` | Doughnut chart — Critical/High/Medium/Low distribution |
| `OwaspCoverage.tsx` | Tag grid of OWASP Top 10 categories found |
| `ExportButton.tsx` | Downloads PDF or JSON report |
| `FilterBar.tsx` | Filter findings by severity, rule type, file |
| `ScanStats.tsx` | Files scanned, lines, duration, finding count |

### PDF export
- Use `pdfkit` or `reportlab` on the backend to generate a single-page styled PDF
- Include project name, date, risk score, finding table

---

## Deployment Plan

| Layer | Platform | Change |
|---|---|---|
| Frontend | Vercel | No change, auto-deploys from `main` |
| Backend | Render | Add Persistent Disk for ChromaDB storage |
| Dependencies | `requirements.txt` | Add `chromadb`, `pdfkit` or `reportlab`, `google-generativeai` |

> [!WARNING]
> ChromaDB's first `build_database.py` run will take ~30–60 seconds to embed the full knowledge base. This only runs once on deploy, not on every scan request.

---

## Phasing Summary

| Phase | Focus | Est. Effort | Standalone Demo? |
|---|---|---|---|
| **1** | Semantic RAG (ChromaDB) | ~2–3 days | ✅ Better quality scan results |
| **2** | AST Rule Expansion (20+ rules) | ~2–3 days | ✅ More finding types shown |
| **3** | Project Scanner + Rich Reports | ~3–4 days | ✅ Scan your own codebase |
| **4** | Dashboard UI + PDF Export | ~3–4 days | ✅ Full recruiter-ready demo |

> [!TIP]
> I recommend tackling **Phase 1 + Phase 2 together** first since they are purely backend with no frontend changes. You can push them as `v2.0-backend` and immediately verify improved scan quality before touching the UI.
