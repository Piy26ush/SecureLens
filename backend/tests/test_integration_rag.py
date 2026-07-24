"""
Interactive Integration Test Script for SecureLens V2.0 Semantic RAG & ChromaDB Retriever
"""

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from backend.rag.retriever import retrieve_security_context
from backend.rag.chroma_store import ChromaVectorStore

def run_tests():
    print("=" * 70)
    print("🧪 SecureLens V2.0 — Testing Semantic RAG & ChromaDB Vector Search")
    print("=" * 70)

    # Check store status
    store = ChromaVectorStore()
    print(f"📊 ChromaDB Store Status  : {'READY' if store.is_ready else 'OFFLINE (Using VSM Fallback)'}")
    if store.is_ready:
        print(f"📦 Total Indexed Chunks   : {store.collection.count()}")
    print("-" * 70)

    # Test Queries across different categories
    test_cases = [
        {
            "query": "cursor.execute('SELECT * FROM users WHERE username = ' + user_input)",
            "category": "sql_injection",
            "label": "Test 1: SQL Injection"
        },
        {
            "query": "subprocess.Popen(cmd_str, shell=True)",
            "category": "command_injection",
            "label": "Test 2: Command Injection"
        },
        {
            "query": "with open('/var/www/uploads/' + filename) as f:",
            "category": "path_traversal",
            "label": "Test 3: Path Traversal"
        }
    ]

    for tc in test_cases:
        print(f"\n🔍 {tc['label']}")
        print(f"   Query Code: {tc['query']}")
        print(f"   Category  : {tc['category']}")

        results = retrieve_security_context(query=tc["query"], category=tc["category"], top_k=2)

        if not results:
            print("   ⚠️  No chunks retrieved.")
        else:
            for idx, res in enumerate(results, 1):
                score = res.get("score", "N/A")
                cwe = res.get("cwe_id", "N/A")
                title = res.get("title", "No Title")
                print(f"   [{idx}] Score: {score} | {cwe} | {title}")
                snippet = res.get("document", "").strip().split("\n")[0][:80]
                print(f"       Snippet: {snippet}...")

    print("\n" + "=" * 70)
    print("✅ All RAG Tests Executed Successfully!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
