import os
import logging
from typing import List, Dict, Any, Optional
from backend.config import CHROMA_PERSIST_DIR, CHROMA_COLLECTION_NAME, RETRIEVER_TOP_K
from backend.rag.data import SECURITY_KNOWLEDGE_BASE

logger = logging.getLogger("securelens.rag.chroma")

try:
    import chromadb
    from chromadb.config import Settings
    from chromadb.utils import embedding_functions
    HAS_CHROMADB = True
except ImportError:
    HAS_CHROMADB = False
    logger.warning("chromadb module not installed. ChromaStore will operate in compatibility mode.")

class ChromaVectorStore:
    """
    ChromaDB Persistent Vector Store for SecureLens Semantic Search.
    Uses Chroma's default local MiniLM-L6-v2 sentence-transformer model for offline embeddings.
    """
    def __init__(self, persist_dir: str = CHROMA_PERSIST_DIR):
        self.persist_dir = persist_dir
        self.client = None
        self.collection = None
        self._is_ready = False
        
        if HAS_CHROMADB:
            try:
                os.makedirs(self.persist_dir, exist_ok=True)
                self.client = chromadb.PersistentClient(path=self.persist_dir)
                
                # Use built-in ONNX-based MiniLM-L6-v2 local embedding function (100% free & offline)
                self.local_ef = embedding_functions.DefaultEmbeddingFunction()
                
                self.collection = self.client.get_or_create_collection(
                    name=CHROMA_COLLECTION_NAME,
                    embedding_function=self.local_ef,
                    metadata={"hnsw:space": "cosine"}
                )
                self._is_ready = True
                logger.info(f"ChromaDB initialized successfully at {self.persist_dir} (Using local MiniLM-L6-v2 embeddings)")
            except Exception as e:
                logger.error(f"Failed to initialize ChromaDB PersistentClient: {e}")
                self._is_ready = False

    @property
    def is_ready(self) -> bool:
        return self._is_ready and self.collection is not None

    def populate_if_empty(self, documents: List[Dict[str, Any]] = SECURITY_KNOWLEDGE_BASE):
        """
        Embeds and indexes documents into ChromaDB if the collection is empty.
        """
        if not self.is_ready:
            logger.warning("ChromaDB is not ready. Skipping population.")
            return

        try:
            count = self.collection.count()
            if count == 0 and documents:
                logger.info(f"Populating ChromaDB collection with {len(documents)} document chunks...")
                ids = [doc["id"] for doc in documents]
                doc_texts = [doc["document"] for doc in documents]
                metadatas = [
                    {
                        "category": doc.get("category", ""),
                        "source": doc.get("source", ""),
                        "cwe_id": doc.get("cwe_id", ""),
                        "owasp_id": doc.get("owasp_id", ""),
                        "title": doc.get("title", ""),
                    }
                    for doc in documents
                ]

                # ChromaDB embeds the texts automatically using local_ef when embeddings is omitted
                self.collection.add(
                    ids=ids,
                    documents=doc_texts,
                    metadatas=metadatas
                )
                logger.info(f"Successfully indexed {len(ids)} document chunks into ChromaDB.")
            else:
                logger.info(f"ChromaDB collection already contains {count} items.")
        except Exception as e:
            logger.error(f"Error populating ChromaDB collection: {e}")

    def query(
        self,
        query_text: str,
        category: Optional[str] = None,
        top_k: int = RETRIEVER_TOP_K
    ) -> List[Dict[str, Any]]:
        """
        Executes a semantic similarity query against ChromaDB.
        Returns top-K matching guidance chunks with similarity scores and metadata.
        """
        if not self.is_ready or self.collection.count() == 0:
            return []

        try:
            where_clause = None
            if category:
                where_clause = {"category": category}

            # ChromaDB automatically embeds query_text using local_ef
            results = self.collection.query(
                query_texts=[query_text],
                n_results=min(top_k, self.collection.count()),
                where=where_clause
            )

            matched_chunks = []
            if results and results.get("documents"):
                docs = results["documents"][0]
                metas = results["metadatas"][0]
                distances = results["distances"][0] if "distances" in results else [0.0] * len(docs)
                ids = results["ids"][0]

                for doc_text, meta, dist, doc_id in zip(docs, metas, distances, ids):
                    # Cosine distance to similarity conversion
                    similarity = round(max(0.0, 1.0 - float(dist)), 4)
                    matched_chunks.append({
                        "id": doc_id,
                        "document": doc_text,
                        "title": meta.get("title", ""),
                        "category": meta.get("category", ""),
                        "source": meta.get("source", ""),
                        "cwe_id": meta.get("cwe_id", ""),
                        "owasp_id": meta.get("owasp_id", ""),
                        "score": similarity,
                        "distance": round(float(dist), 4)
                    })

            return matched_chunks
        except Exception as e:
            logger.error(f"ChromaDB query failed: {e}")
            return []
