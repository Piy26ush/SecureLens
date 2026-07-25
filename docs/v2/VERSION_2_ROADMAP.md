# SecureLens Version 2.0 Roadmap

## Overview

Transform SecureLens from an MVP into a production-inspired AI-assisted secure code auditing platform while preserving the Version 1 core architecture.

---

## 🚀 Version 2.0 Implementation Phases

### Phase 1: Semantic RAG & Vector Storage (ChromaDB + Local ONNX Embeddings)
- **Status**: **[COMPLETED]**
- **Goal**: Replace the pure-Python TF-IDF vector space model with local ONNX `all-MiniLM-L6-v2` embeddings and ChromaDB vector store.
- **Detailed Documentation & Architecture**: [PHASE_1_SEMANTIC_RAG.md](file:///Users/piyush/Desktop/SecureLens/docs/v2/PHASE_1_SEMANTIC_RAG.md)
- **Key Modules**:
  - `backend/rag/chroma_store.py`
  - `backend/rag/build_database.py`
  - `backend/rag/retriever.py`

### Phase 2: AST Rule Engine Expansion (Modular Registry)
- **Status**: **[COMPLETED]**
- **Goal**: Transition from a single-file scanner module to a modular rule engine under `scanner/rules/` with 13 custom detectors.
- **Detailed Documentation & Rules List**: [PHASE_2_RULE_ENGINE.md](file:///Users/piyush/Desktop/SecureLens/docs/v2/PHASE_2_RULE_ENGINE.md)
- **Key Modules**:
  - `backend/scanner/rules.py`
  - `backend/scanner/rules/__init__.py`
  - `backend/scanner/rules/injection_rules.py`
  - `backend/scanner/rules/deserialization_rules.py`
  - `backend/scanner/rules/crypto_secrets_rules.py`
  - `backend/scanner/rules/framework_quality_rules.py`

### Phase 3: Project Scanner & Rich Reports
- **Status**: **[COMPLETED]**
- **Goal**: Support recursive project scanning, project summary metrics, and ReportLab PDF exports.
- **Detailed Documentation**: [PHASE_3_PROJECT_SCANNER.md](file:///Users/piyush/Desktop/SecureLens/docs/v2/PHASE_3_PROJECT_SCANNER.md)
- **Key Modules**:
  - `backend/scanner/pipeline.py`
  - `backend/utils/pdf_generator.py`
  - `backend/main.py`

### Phase 4: Full-Stack Dashboard & Analytics
- **Goal**: Upgrade React UI with project-level file tree uploads, severity distribution charts, OWASP coverage tags, and PDF export buttons.

---

## 📂 Version 2.0 Documentation Structure

- [VERSION_2_ROADMAP.md](file:///Users/piyush/Desktop/SecureLens/docs/v2/VERSION_2_ROADMAP.md) — High-level V2 plan and milestones
- [PHASE_1_SEMANTIC_RAG.md](file:///Users/piyush/Desktop/SecureLens/docs/v2/PHASE_1_SEMANTIC_RAG.md) — ChromaDB & local ONNX embedding vector search architecture
- [PHASE_2_RULE_ENGINE.md](file:///Users/piyush/Desktop/SecureLens/docs/v2/PHASE_2_RULE_ENGINE.md) — Modular AST Scanner engine and rule specifications
- [PHASE_3_PROJECT_SCANNER.md](file:///Users/piyush/Desktop/SecureLens/docs/v2/PHASE_3_PROJECT_SCANNER.md) — Multi-file scanning & PDF exporter specifications
