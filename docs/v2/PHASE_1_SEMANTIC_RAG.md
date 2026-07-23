# Version 2 — Phase 1: Semantic RAG & Vector Storage

> **Status**: **[COMPLETED]**  
> **Key Architecture Upgrade**: Replaced pure-Python TF-IDF Vector Space Model (VSM) with Gemini Embeddings (`text-embedding-004`) & Persistent ChromaDB Vector Store.

---

## 🎯 Engineering Goals & Motivation

### Why did we make this change?
In Version 1, SecureLens used a pure-Python Vector Space Model (VSM) based on TF-IDF term frequency and cosine similarity. While TF-IDF was lightweight and dependency-free, it suffered from fundamental retrieval limitations:
1. **Keyword Satiation & Exact Matching**: TF-IDF only matches literal words (e.g. `cursor.execute`). If a vulnerability query used different phrasing (e.g. `raw SQL string interpolation`), TF-IDF failed to find relevant OWASP/CWE chunks.
2. **Lack of Semantic Understanding**: TF-IDF cannot recognize that "database vulnerability", "SQL injection", and "unsanitized input query" share the same underlying security domain concept.
3. **No Metadata Filtering or Distance Indexing**: In Version 1, filtering by category required manually looping over every document in memory.

### The Solution: Semantic RAG with Gemini Embeddings + ChromaDB
In Version 2 Phase 1, we upgraded the retrieval pipeline to **Semantic Vector Search**:
- **Gemini `text-embedding-004`**: Converts text into 768-dimensional dense vector embeddings that capture deep semantic relationships across security concepts.
- **ChromaDB Vector Store**: A high-performance persistent vector database storing guidance chunks with HNSW cosine distance indexing and native metadata filtering.
- **Dual-Engine Architecture with Graceful Fallback**: If ChromaDB or external API connections are unconfigured/offline, the retriever automatically falls back to our V1 TF-IDF engine, guaranteeing 100% application uptime.

---

## 🏗️ Architecture & Component Overview

```text
backend/rag/
├── data.py             # Security Knowledge Base (OWASP Top 10 + CWE chunks)
├── embedding.py        # Gemini text-embedding-004 client with deterministic fallback
├── chroma_store.py     # Persistent ChromaDB Client & Collection Manager
├── build_database.py   # CLI script to embed and populate ChromaDB collection
└── retriever.py        # Dual-Engine Retrieval API (ChromaDB + TF-IDF Fallback)
```

---

## 🔧 Technical Implementation Details

### 1. `backend/rag/chroma_store.py`
Manages the `ChromaVectorStore` singleton.
- **Local Embedding Model**: Chroma's built-in `DefaultEmbeddingFunction()` (which loads `all-MiniLM-L6-v2` locally via ONNX Runtime).
- **Storage Location**: `backend/rag/chroma_db` (persisted on disk).
- **Collection Name**: `securelens_knowledge_base`.
- **Distance Metric**: `cosine` similarity (`hnsw:space`: `cosine`).
- **Metadata Indexing**: Each chunk includes `category`, `source`, `cwe_id`, `owasp_id`, and `title`.

### 2. `backend/rag/build_database.py`
Automated builder script that iterates over `SECURITY_KNOWLEDGE_BASE` in `data.py` and indexes the text chunks into ChromaDB, triggering local embedding calculations.

### 3. `backend/rag/retriever.py`
Exposes the core function `retrieve_security_context(query: str, category: str, top_k: int = 2)`:
1. First queries `ChromaVectorStore` using semantic cosine similarity and metadata category matching.
2. If ChromaDB returns matched chunks, formats and returns them with similarity scores (`0.0` - `1.0`).
3. If ChromaDB is unavailable, seamlessly uses `VectorStoreVSM` (TF-IDF) as a fail-safe fallback.

---

## 📊 Summary of System Changes

| Component | Version 1 (MVP) | Version 2 Phase 1 (Semantic RAG) |
|---|---|---|
| **Vector Model** | Term Frequency - Inverse Document Frequency (TF-IDF) | Dense Neural Embeddings (`all-MiniLM-L6-v2`) |
| **Vector Space** | Sparse Vocabulary-sized (~200 dimensions) | 384-dimensional Semantic Vector Space |
| **Database** | In-Memory Python Dictionary | Persistent Disk Vector Store (ChromaDB) |
| **Search Type** | Lexical / Exact Word Match | Deep Semantic Cosine Similarity Search |
| **Resilience** | Memory-bound | Dual-Engine Fail-safe (ChromaDB + TF-IDF Fallback) |

---

## 🚀 How to Run & Verify

1. **Populate ChromaDB Collection**:
   ```bash
   python3 backend/rag/build_database.py
   ```
2. **Test Semantic Retrieval**:
   ```python
   from backend.rag.retriever import retrieve_security_context
   
   results = retrieve_security_context(
       query="raw string formatting inside cursor query",
       category="sql_injection",
       top_k=2
   )
   for res in results:
       print(res["title"], res["score"])
   ```
