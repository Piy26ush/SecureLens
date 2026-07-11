import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from scanner.pipeline import run_scan_pipeline, build_prompt

class TestPipeline(unittest.TestCase):
    def test_pipeline_offline_fallback(self):
        # Temporarily clear API keys to test offline mode
        old_gemini = os.environ.get("GEMINI_API_KEY")
        old_groq = os.environ.get("GROQ_API_KEY")
        if "GEMINI_API_KEY" in os.environ:
            del os.environ["GEMINI_API_KEY"]
        if "GROQ_API_KEY" in os.environ:
            del os.environ["GROQ_API_KEY"]
            
        try:
            vulnerable_code = "eval(input())"
            findings = run_scan_pipeline(vulnerable_code)
            self.assertEqual(len(findings), 1)
            self.assertEqual(findings[0]["type"], "eval_exec")
            self.assertTrue("API keys" in findings[0]["explanation"])
            self.assertTrue("attack_scenario" in findings[0])
            self.assertTrue("AST Rules Engine" in findings[0]["source_citation"])
        finally:
            # Restore original environment
            if old_gemini is not None:
                os.environ["GEMINI_API_KEY"] = old_gemini
            if old_groq is not None:
                os.environ["GROQ_API_KEY"] = old_groq

    def test_prompt_construction(self):
        finding = {
            "type": "sql_injection",
            "line": 4,
            "severity": "HIGH",
            "snippet": "cursor.execute(f'SELECT * FROM users WHERE id = {user_id}')",
            "cwe_id": "CWE-89",
            "owasp_id": "A03:2021"
        }
        contexts = [
            {"title": "Test OWASP", "document": "Never construct SQL queries dynamically."}
        ]
        prompt = build_prompt(finding, contexts)
        self.assertTrue("sql_injection" in prompt)
        self.assertTrue("CWE-89" in prompt)
        self.assertTrue("Test OWASP" in prompt)
        self.assertTrue("JSON" in prompt)

if __name__ == "__main__":
    unittest.main()
