"""
Build Database Script — SecureLens V2.0 Semantic RAG
Initializes and populates the ChromaDB Vector Database with the OWASP & CWE Security Knowledge Base.
"""

import sys
import os
import logging

# Ensure parent path is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from backend.rag.data import SECURITY_KNOWLEDGE_BASE
from backend.rag.chroma_store import ChromaVectorStore
from backend.config import CHROMA_PERSIST_DIR, CHROMA_COLLECTION_NAME

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("securelens.rag.build_database")

def build_vector_database():
    print("=" * 60)
    print("🚀 SecureLens V2.0 — Building Semantic RAG Vector Database")
    print("=" * 60)
    print(f"📌 Knowledge Base Size : {len(SECURITY_KNOWLEDGE_BASE)} document chunks")
    print(f"📁 Persistence Location: {CHROMA_PERSIST_DIR}")
    print(f"📦 Collection Name     : {CHROMA_COLLECTION_NAME}")
    print("-" * 60)

    store = ChromaVectorStore()
    if not store.is_ready:
        print("⚠️  ChromaDB is not ready or installed. Skipping build.")
        return False

    print("🔄 Generating Gemini embeddings & populating ChromaDB...")
    store.populate_if_empty(SECURITY_KNOWLEDGE_BASE)
    
    count = store.collection.count()
    print("-" * 60)
    print(f"✅ Build Complete! Total Indexed Documents in ChromaDB: {count}")
    print("=" * 60)
    return True

if __name__ == "__main__":
    build_vector_database()
