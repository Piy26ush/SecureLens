import os

# Try loading env variables from a local .env file
try:
    from dotenv import load_dotenv
    dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.env"))
    load_dotenv(dotenv_path)
except ImportError:
    pass

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "").strip()

# Models config
GEMINI_MODEL = "gemini-3.5-flash"
GROQ_MODEL = "llama-3.3-70b-versatile"
EMBEDDING_MODEL = "text-embedding-004"

# Connection & RAG configurations
TIMEOUT_SECONDS = 30
RETRIEVER_TOP_K = 2
USE_SEMANTIC_RAG = True

# ChromaDB Persistence
CHROMA_PERSIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "chroma_db"))
CHROMA_COLLECTION_NAME = "securelens_knowledge_base"
