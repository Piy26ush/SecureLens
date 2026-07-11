# Phase 2: RAG Database & Ingestion Explanation

This document contains the detailed explanation of what we built in Phase 2, why we built it, and the technical concepts behind it.

---

## 1. Why a Custom Vector Space Model (VSM) instead of ChromaDB?
In our initial blueprint, we planned to use ChromaDB and run the `all-MiniLM-L6-v2` transformer model locally. However, in a real-world sandbox or environment-constrained deployment:
1.  **Heavy Dependencies**: Libraries like PyTorch, tokenizers, and ChromaDB consume gigabytes of disk space and require compiling complex C++ bindings (like SQLite or cargo packages) which are prone to platform errors.
2.  **Memory Overhead**: Running transformer models inside tiny containers (like Railway's free tier) frequently causes out-of-memory (OOM) crashes.

To keep our system **ultra-lightweight, 100% reliable, and fast**, we implemented a custom, pure-Python **Vector Space Model (VSM)** using the TF-IDF algorithm. It runs in milliseconds, uses zero external dependencies, works completely offline, and teaches the core mechanics of vector search without hiding it behind an import!

---

## 2. Core Concept: Vector Space Model (VSM) & TF-IDF
In search engines, a Vector Space Model represents text documents as vectors (coordinates) in a high-dimensional space. The coordinates of these vectors are computed using **TF-IDF**:

### A. Term Frequency (TF)
How often a word appears in a specific document. If a document chunk talks about "prepared statements" multiple times, the word "prepared" will have a high TF score.
$$\text{TF}(t, d) = \text{count of term } t \text{ in document } d$$

### B. Inverse Document Frequency (IDF)
Measures how unique a word is across the *entire* collection of documents. 
*   Common words (like "code" or "security") appear in almost every document, so their IDF score is low.
*   Specific words (like "deserialization" or "parameterized") appear in only a few documents, so their IDF score is high.
$$\text{IDF}(t) = \log\left(1 + \frac{\text{Total Documents}}{1 + \text{Docs containing } t}\right)$$

### C. TF-IDF Weight
The final coordinate weight is $\text{TF} \times \text{IDF}$. This ensures that highly descriptive, unique keywords carry the most weight in our vector index.

---

## 3. How Cosine Similarity Search Works
To find the closest security guidelines for an AST finding:
1.  **Metadata Filtering**: If the AST scanner flags a SQL injection, we filter our database to only keep documents labeled `category="sql_injection"`. This removes unrelated documents from the math entirely, maximizing retrieval precision.
2.  **Query Vectorization**: We tokenize the query (e.g. *"parameterized prepared query execution"*) and calculate its TF-IDF vector.
3.  **Cosine Similarity**: We calculate the angle between the query vector ($\vec{q}$) and each document vector ($\vec{d}$). The cosine of the angle ranges from 0 (completely unrelated) to 1 (identical meaning).
$$\text{Similarity}(\vec{q}, \vec{d}) = \frac{\vec{q} \cdot \vec{d}}{\|\vec{q}\| \|\vec{d}\|} = \frac{\sum (q_i \times d_i)}{\sqrt{\sum q_i^2} \times \sqrt{\sum d_i^2}}$$
4.  **Top-K Retrieval**: We sort the documents based on their similarity scores and return the top 3 matches to feed into our LLM prompt.

---

## 4. Ingestion Database structure
Our knowledge base in [backend/rag/data.py](file:///Users/piyush/Desktop/SECURITY%20AUDIT/backend/rag/data.py) contains hand-curated, structured chunks from:
*   **OWASP Top 10**: Categorized descriptions of application vulnerabilities.
*   **OWASP Cheat Sheets**: Best-practice code blocks on how to resolve injections, path traversal, etc.
*   **CWE Definitions**: Industry standards detailing specific software weaknesses.

---

## 5. Verification Results
We wrote unit tests in [tests/test_retriever.py](file:///Users/piyush/Desktop/SECURITY%20AUDIT/tests/test_retriever.py) which verify:
1.  **Category Filtering**: Querying for SQLi constructs never leaks command injection or path traversal results.
2.  **Semantic Ranking**: Searching for keywords (like "shell" or "directory") correctly scores and retrieves the most relevant documents.

All retriever tests pass successfully (`OK` status).
