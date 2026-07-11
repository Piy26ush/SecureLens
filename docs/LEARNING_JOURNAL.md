# Securelens Learning Journal

This journal serves as the high-level roadmap and progress tracker for the **Securelens** implementation. For each phase, we outline the goals and link to a dedicated, detailed explanation file.

---

## 🚀 The Implementation Phases

### Phase 1: Project Setup & AST Scanner
*   **Goal**: Create the backend directory structure, set up a FastAPI skeleton, and implement a local static security analyzer (AST Scanner) using Python's native `ast` module to find vulnerabilities deterministically.
*   **Status**: **[COMPLETED]**
*   **Detailed Explanation & Core Concepts**: [PHASE_1_AST_SCANNER.md](file:///Users/piyush/Desktop/SecureLens/PROJECT%20DATA/PHASE_1_AST_SCANNER.md)

### Phase 2: RAG Database & Ingestion
*   **Goal**: Create a database containing OWASP guidelines/CWE databases, implement a pure-Python Vector Space Model (VSM) using TF-IDF for dependency-free local search, and write a metadata-filtered retriever.
*   **Status**: **[COMPLETED]**
*   **Detailed Explanation & Core Concepts**: [PHASE_2_RAG_DATABASE.md](file:///Users/piyush/Desktop/SecureLens/PROJECT%20DATA/PHASE_2_RAG_DATABASE.md)

### Phase 3: LLM Integration & API Completion
*   **Goal**: Build a connection pipeline supporting both Gemini (Primary) and Groq/Llama 3.1 (Fallback) APIs, assemble structured prompts (AST findings + RAG chunks), and complete the `/api/scan` endpoint.
*   **Status**: **[COMPLETED]**
*   **Detailed Explanation & Core Concepts**: [PHASE_3_LLM_PIPELINE.md](file:///Users/piyush/Desktop/SecureLens/PROJECT%20DATA/PHASE_3_LLM_PIPELINE.md)

### V1.0 Refactoring & Refinement
*   **Goal**: Refactor the backend architecture to support centralized configuration, decoupled prompts, standardized logging, and strict Pydantic model validations for API request/response integrity.
*   **Status**: **[COMPLETED]**
*   **Detailed Explanation & Core Concepts**: [V1_REFINEMENT.md](file:///Users/piyush/Desktop/SecureLens/PROJECT%20DATA/V1_REFINEMENT.md)

### Phase 4: React UI & End-to-End Integration
*   **Goal**: Bootstrap a React + Vite frontend workspace, build the interactive layout with Monaco Editor (code input) and severity finding cards, and test the full application.
*   **Status**: *[PENDING]*
*   **Detailed Explanation**: *(Will be added as PHASE_4_REACT_UI.md when started)*
