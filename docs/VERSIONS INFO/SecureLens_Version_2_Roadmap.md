# SecureLens Version 2.0 Roadmap

## Goal

Transform SecureLens from an MVP into a production-inspired AI-assisted
secure code auditing platform while preserving the Version 1
architecture.

## 1. Semantic RAG

-   Replace TF-IDF with Gemini Embeddings
-   ChromaDB vector database
-   Semantic search
-   Persistent vector storage
-   Top-K retrieval
-   Metadata support

### New Modules

``` text
backend/
└── rag/
    ├── build_database.py
    ├── embedding.py
    ├── chroma_store.py
    ├── retrieve.py
    └── utils.py
```

## 2. Security Knowledge Base

-   OWASP Top 10
-   CWE references
-   Python Secure Coding Guidelines
-   Security Best Practices
-   Rich metadata and references

## 3. AST Scanner Expansion

Increase from \~8 to 20--25 rules: - Code Execution - Unsafe
Deserialization - SQL Injection - Command Injection - Path Traversal -
Hardcoded Secrets - Weak Cryptography - Weak Randomness - Network
Misconfiguration - Flask Debug Mode - Bare Exception Handling - Assert
Misuse - Unsafe YAML Loading

## 4. Modular Rule Engine

``` text
scanner/
├── scanner.py
└── rules/
    ├── eval_rule.py
    ├── sql_rule.py
    ├── pickle_rule.py
    └── ...
```

## 5. Project Scanner

-   Recursive folder scanning
-   Ignore venv/cache folders
-   Aggregate findings
-   Count files and lines

## 6. Findings Aggregator

Each finding includes: - File - Line - Severity - Rule - Snippet -
Explanation

## 7. Semantic Retrieval Pipeline

Finding → Query → Embedding → ChromaDB → Top-K Docs → Gemini

## 8. Prompt Engineering

``` text
prompts/
├── explanation.txt
├── remediation.txt
├── attack.txt
└── summary.txt
```

## 9. LLM Optimization

-   Batch processing
-   Retry mechanism
-   Timeout handling
-   Fallback model

## 10. Performance

-   Async FastAPI
-   asyncio
-   Concurrent processing
-   Embedding cache
-   Chroma persistence
-   LRU cache

## 11. API Improvements

-   GET /health
-   POST /scan
-   POST /scan-project
-   POST /export
-   GET /models
-   GET /stats

## 12. Pydantic Models

-   Finding
-   Report
-   Metrics
-   ProjectSummary
-   Citation

## 13. Rich Reports

-   Risk Score
-   Executive Summary
-   Severity Distribution
-   OWASP Coverage
-   CWE Mapping
-   Recommendations
-   Detailed Findings

## 14. Export

-   PDF
-   JSON

## 15. Dashboard

-   Project Scan
-   Security Score
-   Charts
-   Filters
-   Export

## 16. Scan Statistics

-   Files
-   Lines
-   Findings
-   Severity counts
-   Duration

## 17. Architecture

``` text
backend/
├── config.py
├── constants.py
├── logger.py
├── exceptions.py
├── dependencies.py
└── utils.py
```

## 18. Logging

-   Scanner
-   API
-   Retriever
-   LLM
-   Performance
-   Errors

## 19. Configuration

Move API keys, thresholds, models, Top-K, and timeouts into config.py.

## 20. Error Handling

-   Invalid Python
-   Empty Input
-   API Failure
-   Timeout
-   Embedding Failure
-   Database Failure

## 21. Documentation

``` text
docs/
├── VERSION2_OVERVIEW.md
├── SEMANTIC_RAG.md
├── PROJECT_SCANNER.md
├── CHROMADB.md
├── RULE_ENGINE.md
├── PERFORMANCE.md
├── API.md
└── ARCHITECTURE.md
```

## 22. Testing

``` text
tests/
├── scanner/
├── rag/
├── api/
└── integration/
```

## 23. Deployment

-   Frontend: Vercel
-   Backend: Render
-   Deployment guide

## 24. Deliverables

-   Custom AST Scanner
-   Modular Rule Engine
-   Gemini Embeddings
-   ChromaDB
-   Semantic RAG
-   Project Scanner
-   Batched LLM
-   Async FastAPI
-   React Dashboard
-   PDF/JSON Export
-   Documentation

## Final Objective

Deliver a production-inspired AI-assisted secure code auditing platform
capable of scanning individual files and complete Python projects using
AST analysis, semantic retrieval, and grounded LLM explanations.
