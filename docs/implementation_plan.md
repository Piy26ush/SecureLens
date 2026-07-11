# Implementation Plan: Building Securelens

We will build the **Securelens** application—a hybrid AST + RAG security code auditor—across 4 distinct, educational phases. To facilitate learning, we maintain a roadmap companion file, `LEARNING_JOURNAL.md`, in the workspace.

For Version 1, we will refactor the codebase to implement professional software engineering practices (centralized configurations, decoupled prompts, standardized logging, and strict Pydantic API response models) before exposing the API for frontend integrations.

---

## User Review Required

> [!IMPORTANT]
> **API Key Setup**: We support **both Groq API (Llama 3.1)** and **Gemini API** for LLM inference. To run the completed pipeline, you can choose to provide either a free Groq API key or a Gemini API key (or both, allowing toggling/failover). These keys will be configured in a `.env` file and managed by a centralized configuration file.

---

## Proposed Changes

### Component 1: Configurations & Prompts Decoupling

#### [NEW] [config.py](file:///Users/piyush/Desktop/SecureLens/backend/config.py)
*   Centralize environment variable reading, API key settings, provider selection, timeout parameters, and vector retrieval `top_k`.

#### [NEW] [security_prompt.py](file:///Users/piyush/Desktop/SecureLens/backend/prompts/security_prompt.py)
*   Decouple Prompt Engineering from LLM calls by moving `build_prompt()` here.

---

### Component 2: Core Scanner & Pipeline Logging

#### [MODIFY] [pipeline.py](file:///Users/piyush/Desktop/SecureLens/backend/scanner/pipeline.py)
*   Refactor to import configuration from `config.py` and prompts from `prompts/security_prompt.py`.
*   Replace standard `print()` statements with Python's standard `logging` module (`logger.info`, `logger.warning`, `logger.error`).

---

### Component 3: API Models & Response Validation

#### [MODIFY] [main.py](file:///Users/piyush/Desktop/SecureLens/backend/main.py)
*   Define validated Pydantic response schemas for scan outputs: `FindingModel`, `ScanResponse`, and `HealthResponse`.
*   Configure FastAPI to validate responses using these schemas instead of returning raw dicts.
*   Configure standard logging.

---

### Component 4: Local V1.0 Knowledge Base

#### [NEW] [data.py](file:///Users/piyush/Desktop/SecureLens/backend/rag/data.py)
*   Contains the curated reference docs for OWASP and CWE.

#### [NEW] [retriever.py](file:///Users/piyush/Desktop/SecureLens/backend/rag/retriever.py)
*   Implements the pure-Python Vector Space Model (VSM) search engine.

---

## Verification Plan

### Automated Tests
*   Verify AST scan logic: `python3 tests/test_scanner.py`
*   Verify Vector search logic: `python3 tests/test_retriever.py`
*   Verify LLM pipeline and offline fallback: `python3 tests/test_pipeline.py`

### Manual Verification
*   Launch FastAPI locally using `uvicorn main:app --reload`.
*   Access `http://localhost:8000/docs` (Swagger UI) in the browser to visually check the request/response validation schemas and execute a sample scan payload.
