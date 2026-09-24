import unittest
import sys
import os

# Ensure backend can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.scanner.scanner import scan_code_ast

class TestSastDataFlow(unittest.TestCase):
    """
    Comprehensive SAST Test Suite verifying Intra-Procedural Symbol Tracking,
    Local Data-Flow, Taint Propagation, and Evidence Generation.
    """

    # --- SQL Injection Reference Tests ---

    def test_sqli_case_a_direct_flow(self):
        """Case A: Direct untrusted source flowing to SQL sink."""
        code = """
def handle_request():
    user = request.args['id']
    cursor.execute("SELECT * FROM users WHERE id=" + user)
"""
        findings = scan_code_ast(code)
        sqli = [f for f in findings if f["type"] == "sql_injection"]
        self.assertEqual(len(sqli), 1)
        self.assertEqual(sqli[0]["detection_method"], "taint_dataflow")
        self.assertIn("request.args['id']", sqli[0]["evidence"]["source"])
        self.assertIn("cursor.execute", sqli[0]["evidence"]["sink"])

    def test_sqli_case_b_alias_flow(self):
        """Case B: Aliased variable propagation."""
        code = """
def handle_request():
    user = request.args['id']
    x = user
    cursor.execute("SELECT * FROM users WHERE id=" + x)
"""
        findings = scan_code_ast(code)
        sqli = [f for f in findings if f["type"] == "sql_injection"]
        self.assertEqual(len(sqli), 1)
        self.assertEqual(sqli[0]["detection_method"], "taint_dataflow")
        self.assertIn("x = user", str(sqli[0]["evidence"]["flow"]))

    def test_sqli_case_c_multistep_flow(self):
        """Case C: Multi-step variable propagation with full evidence path."""
        code = """
def handle_request():
    user = request.args['id']
    x = user
    query = "SELECT * FROM users WHERE id=" + x
    cursor.execute(query)
"""
        findings = scan_code_ast(code)
        sqli = [f for f in findings if f["type"] == "sql_injection"]
        self.assertEqual(len(sqli), 1)
        evidence = sqli[0]["evidence"]
        self.assertEqual(evidence["analysis_type"], "taint_dataflow")
        self.assertIn("request.args['id']", evidence["source"])
        self.assertTrue(len(evidence["flow"]) >= 2)

    def test_sqli_case_d_fstring(self):
        """Case D: F-string interpolation with tainted symbol."""
        code = """
def handle_request():
    user = request.args['id']
    query = f"SELECT * FROM users WHERE id={user}"
    cursor.execute(query)
"""
        findings = scan_code_ast(code)
        sqli = [f for f in findings if f["type"] == "sql_injection"]
        self.assertEqual(len(sqli), 1)
        self.assertEqual(sqli[0]["detection_method"], "taint_dataflow")

    def test_sqli_case_e_safe_parameterized_query(self):
        """Case E: Parameterized query boundary (True Negative)."""
        code = """
def handle_request():
    user = request.args['id']
    cursor.execute("SELECT * FROM users WHERE id = ?", (user,))
"""
        findings = scan_code_ast(code)
        sqli = [f for f in findings if f["type"] == "sql_injection"]
        self.assertEqual(len(sqli), 0, "Parameterized queries must not trigger SQL injection findings")

    def test_sqli_case_f_trusted_constant(self):
        """Case F: Static trusted constant query (True Negative)."""
        code = """
def handle_request():
    query = "SELECT * FROM users WHERE active=1"
    cursor.execute(query)
"""
        findings = scan_code_ast(code)
        sqli = [f for f in findings if f["type"] == "sql_injection"]
        self.assertEqual(len(sqli), 0, "Constant queries must not trigger SQL injection findings")

    def test_sqli_case_g_reassignment_to_constant(self):
        """Case G: Reassignment to safe constant kills taint (True Negative)."""
        code = """
def handle_request():
    user = request.args['id']
    user = "default_admin"
    cursor.execute("SELECT * FROM users WHERE id=" + user)
"""
        findings = scan_code_ast(code)
        sqli = [f for f in findings if f["type"] == "sql_injection"]
        self.assertEqual(len(sqli), 0, "Reassigning variable to constant must clear taint state")

    # --- Command Injection Tests ---

    def test_command_injection_tainted(self):
        """Untrusted input flowing to os.system sink."""
        code = """
def run_command():
    cmd = request.args['cmd']
    target = cmd
    os.system("ping -c 1 " + target)
"""
        findings = scan_code_ast(code)
        ci = [f for f in findings if f["type"] == "command_injection"]
        self.assertEqual(len(ci), 1)
        self.assertEqual(ci[0]["detection_method"], "taint_dataflow")

    def test_command_injection_safe_constant_list(self):
        """Safe subprocess invocation without shell=True (True Negative)."""
        code = """
def run_command():
    subprocess.run(["ls", "-la"])
"""
        findings = scan_code_ast(code)
        ci = [f for f in findings if f["type"] == "command_injection"]
        self.assertEqual(len(ci), 0, "Constant argument list must not trigger command injection")

    # --- Path Traversal Tests ---

    def test_path_traversal_tainted(self):
        """Untrusted input flowing to open() sink."""
        code = """
def read_doc():
    filename = request.args['file']
    filepath = "/var/data/" + filename
    with open(filepath, 'r') as f:
        return f.read()
"""
        findings = scan_code_ast(code)
        pt = [f for f in findings if f["type"] == "path_traversal"]
        self.assertEqual(len(pt), 1)
        self.assertEqual(pt[0]["detection_method"], "taint_dataflow")

    def test_path_traversal_safe_constant(self):
        """Safe constant filepath (True Negative)."""
        code = """
def read_doc():
    with open("config.json", 'r') as f:
        return f.read()
"""
        findings = scan_code_ast(code)
        pt = [f for f in findings if f["type"] == "path_traversal"]
        self.assertEqual(len(pt), 0, "Static filepath must not trigger path traversal")

    # --- Eval / Exec Code Execution ---

    def test_eval_exec_tainted_provenance(self):
        """Tainted variable executed inside eval()."""
        code = """
def evaluate_math():
    raw_expr = request.args['expr']
    res = eval(raw_expr)
"""
        findings = scan_code_ast(code)
        ev = [f for f in findings if f["type"] == "eval_exec"]
        self.assertEqual(len(ev), 1)
        self.assertEqual(ev[0]["detection_method"], "taint_dataflow")
        self.assertIn("request.args['expr']", ev[0]["evidence"]["source"])

if __name__ == "__main__":
    unittest.main()
