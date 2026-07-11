import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from rag.retriever import retrieve_security_context

class TestRetriever(unittest.TestCase):
    def test_category_filtering(self):
        # A SQL Injection query should return only sql_injection category documents
        results = retrieve_security_context("parameterized query", category="sql_injection", top_k=5)
        self.assertTrue(len(results) > 0)
        for doc in results:
            self.assertEqual(doc["category"], "sql_injection")

    def test_similarity_ranking(self):
        # A query containing command injection keywords should retrieve command injection documents
        results = retrieve_security_context("os.system run shell", category="command_injection", top_k=1)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["category"], "command_injection")
        self.assertTrue("command" in results[0]["document"].lower() or "shell" in results[0]["document"].lower())

    def test_path_traversal_retrieval(self):
        results = retrieve_security_context("directory traversal path traversal open file", category="path_traversal", top_k=1)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["category"], "path_traversal")
        self.assertTrue("cwe-22" in results[0]["id"].lower() or "owasp-path" in results[0]["id"].lower())

if __name__ == "__main__":
    unittest.main()
