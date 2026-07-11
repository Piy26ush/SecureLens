import unittest
import sys
import os

# Adjust path so python can find backend directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))
from scanner.rules import scan_code_ast

class TestScanner(unittest.TestCase):
    def test_eval_exec_detection(self):
        vulnerable_code = "eval(input('Enter code: '))"
        findings = scan_code_ast(vulnerable_code)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0]["type"], "eval_exec")
        self.assertEqual(findings[0]["severity"], "CRITICAL")
        self.assertEqual(findings[0]["cwe_id"], "CWE-95")

    def test_pickle_loads_detection(self):
        vulnerable_code = """
import pickle
data = get_network_input()
obj = pickle.loads(data)
"""
        findings = scan_code_ast(vulnerable_code)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0]["type"], "pickle_loads")
        self.assertEqual(findings[0]["severity"], "CRITICAL")

    def test_command_injection_detection(self):
        vulnerable_code = """
import os
import subprocess
ip = get_user_ip()
os.system("ping " + ip)
subprocess.run(f"nslookup {ip}", shell=True)
"""
        findings = scan_code_ast(vulnerable_code)
        self.assertEqual(len(findings), 2)
        types = [f["type"] for f in findings]
        self.assertTrue(all(t == "command_injection" for t in types))

    def test_command_safe_call(self):
        safe_code = """
import os
os.system("ping -c 1 127.0.0.1")
"""
        findings = scan_code_ast(safe_code)
        self.assertEqual(len(findings), 0)

    def test_sql_injection_detection(self):
        vulnerable_code = """
query = f"SELECT * FROM users WHERE name = '{name}'"
cursor.execute(query)
cursor.raw("SELECT * FROM products WHERE id = " + product_id)
"""
        findings = scan_code_ast(vulnerable_code)
        self.assertEqual(len(findings), 2)
        self.assertEqual(findings[0]["type"], "sql_injection")
        self.assertEqual(findings[1]["type"], "sql_injection")

    def test_sql_injection_safe_call(self):
        safe_code = """
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))
"""
        findings = scan_code_ast(safe_code)
        self.assertEqual(len(findings), 0)

    def test_path_traversal_detection(self):
        vulnerable_code = """
filename = get_filename()
open(f"data/{filename}", "r")
"""
        findings = scan_code_ast(vulnerable_code)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0]["type"], "path_traversal")

    def test_hardcoded_secret_detection(self):
        vulnerable_code = """
db_password = "super-secret-password-123"
api_key = "key_abcdef123456"
"""
        findings = scan_code_ast(vulnerable_code)
        self.assertEqual(len(findings), 2)
        self.assertEqual(findings[0]["type"], "hardcoded_secret")
        self.assertEqual(findings[1]["type"], "hardcoded_secret")
        self.assertTrue("super-secret-password-123" not in findings[0]["snippet"])
        self.assertTrue("key_abcdef123456" not in findings[1]["snippet"])

    def test_syntax_error_handling(self):
        invalid_code = "if x = 5:"
        findings = scan_code_ast(invalid_code)
        self.assertEqual(len(findings), 1)
        self.assertEqual(findings[0]["type"], "syntax_error")

if __name__ == "__main__":
    unittest.main()
