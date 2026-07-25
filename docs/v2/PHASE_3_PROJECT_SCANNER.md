# Version 2 — Phase 3: Project Scanner & Rich Reports

> **Status**: **[COMPLETED]**  
> **Key Architecture Upgrade**: Upgraded the API from single-paste scans to multi-file project scans (`POST /api/scan-project`), introduced AI explanation caching to drop scan latency, and built an in-memory PDF report exporter (`POST /api/export-report`).

---

## 🎯 Engineering Goals & Motivation

### Why did we make this change?
In previous phases, the backend could only receive a single block of code as a text string. This restricted utility to copy-paste actions. In Phase 3, we targeted two core operational goals:
1. **Multi-File Context**: A real application consists of multiple files (e.g. `app.py`, `models.py`, `utils.py`). The scan engine must accept directory payloads to build a comprehensive security audit of a codebase.
2. **AI Explanation Optimizations (Caching)**: Querying Gemini for every single security finding causes serious latency delays and consumes token limits if the project has duplicate findings (e.g., hardcoded secrets in multiple test files). We needed to optimize latency by caching descriptions.
3. **Rich Export Formats (PDF)**: Developers and security officers need to share scan results. Generating a styled, print-friendly PDF report natively on the backend provides a downloadable deliverable.

---

## 🏗️ Architecture & Component Upgrades

```text
backend/
├── main.py                     # Added /scan-project, /export-report, /stats, and /models
├── scanner/
│   └── pipeline.py             # Implemented run_project_scan_pipeline with caching
└── utils/
    └── pdf_generator.py        # NEW: In-memory PDF compiler (ReportLab)
```

---

## 🔧 Technical Details

### 1. Project Scan Pipeline & Caching
The orchestrator in `backend/scanner/pipeline.py` now runs AST scans across all submitted files, collects findings, and extracts the unique set of vulnerability types (e.g., `{"sql_injection", "weak_crypto"}`).
* **Template Generation**: Gemini cascade is queried exactly **once per unique vulnerability type** to generate explanation, attack scenario, and secure fix code block templates.
* **Metadata Mapping**: The pipeline instantly maps these templates back to all occurrences across the codebase, inserting line-specific details.
* **Latency Reduction**: Lowers total LLM requests from `O(N)` (findings) to `O(U)` (unique types), dropping total project scan time to under **4 seconds**.

### 2. Pure-Python PDF Generation (ReportLab)
The `pdf_generator.py` module uses the **ReportLab** library to compile a structured PDF in-memory.
* **Design Palette**: High-contrast editorial style (slate-900 headers, custom warning colors, monospace code blocks, margin spacers).
* **Memory Efficiency**: Runs completely in-memory using `io.BytesIO` streams, making it OOM-safe on the 512MB Render free tier and eliminating temporary filesystem cleanup requirements.
* **Built-in Fonts**: Uses standard PostScript fonts (`Helvetica`, `Courier`) to prevent system-font compile errors.

---

## 🚀 API Endpoints Added

* `POST /api/scan-project`: Scans multiple files submitted in JSON format.
* `POST /api/export-report`: Compiles findings and returns downloadable PDF binaries.
* `GET /api/stats`: Collects runtime statistics (average risk score, findings count).
* `GET /api/models`: Returns cascade hierarchy information.
