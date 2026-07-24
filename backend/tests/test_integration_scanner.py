"""
Test Script for SecureLens V2.0 Modular AST Rule Engine
"""

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from backend.scanner.scanner import scan_code_ast

def run_scanner_test():
    print("=" * 70)
    print("🧪 SecureLens V2.0 — Testing Modular AST Rule Engine")
    print("=" * 70)

    # Test cases containing vulnerabilities targeting all 13 rules
    test_code = """
import os
import pickle
import yaml
import hashlib
import random

# Rule 7: Hardcoded Secret
API_KEY = "AQ.Ab8RN6LkYV3XjLhOmKS3yOpR"

def demo_eval(user_input):
    # Rule 1: Eval/Exec Code Execution
    eval(user_input)

def demo_sqli(db_conn, username):
    # Rule 2: SQL Injection
    query = "SELECT * FROM users WHERE name = '" + username + "'"
    db_conn.execute(query)

def demo_cmd_injection(filename):
    # Rule 3: Command Injection
    os.system("ls -la " + filename)

def demo_path_traversal(user_path):
    # Rule 4: Path Traversal
    with open("uploads/" + user_path, "r") as f:
        return f.read()

def demo_pickle(data):
    # Rule 5: Unsafe Pickle
    return pickle.loads(data)

def demo_yaml(yaml_data):
    # Rule 6: Unsafe YAML load
    return yaml.load(yaml_data)

def demo_weak_crypto(data):
    # Rule 8: Weak Crypto MD5/SHA1
    m = hashlib.md5()
    m.update(data)
    h = hashlib.new('sha1')
    return m.hexdigest()

def demo_weak_random():
    # Rule 9: Weak Pseudo-Randomness
    return random.random()

def run_app():
    # Rule 10: Flask debug mode
    # Rule 13: Network misconfig binding to 0.0.0.0
    app.run(host="0.0.0.0", debug=True)

def demo_bare_except():
    # Rule 11: Bare Exception
    try:
        val = 1 / 0
    except:
        pass

def demo_assert(role):
    # Rule 12: Assert misuse for validation
    assert role == "admin"
    print("Welcome admin!")
"""

    print("🔍 Running AST scan on multi-vulnerability source code...")
    findings = scan_code_ast(test_code)

    print(f"📊 Total Findings Detected: {len(findings)}\n")
    for idx, f in enumerate(findings, 1):
        print(f"   [{idx}] Line {f['line']} | {f['severity']} | Type: {f['type']}")
        print(f"       Snippet: {f['snippet']}")
        print(f"       CWE: {f['cwe_id']} | OWASP: {f['owasp_id']}")
        print("-" * 50)

    print("=" * 70)
    print("✅ AST Modular Rules Verification Complete!")
    print("=" * 70)

if __name__ == "__main__":
    run_scanner_test()
