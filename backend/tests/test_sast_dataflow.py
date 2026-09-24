import unittest
import sys
import os

# Ensure backend can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.scanner.scanner import scan_code_ast

class TestSastDataFlow(unittest.TestCase):
    """
    Comprehensive SAST Test Suite verifying Intra-Procedural Symbol Tracking,
    Local Data-Flow, Taint Propagation, Sanitizers, Unpacking, Scope Shadowing,
    May-Taint Branching, and Evidence Generation.
    """

    # --- 1. SQL Injection Reference Tests ---

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

    # --- 2. Sanitizers & Neutralization Tests ---

    def test_command_sanitizer_shlex_quote(self):
        """shlex.quote() sanitizes command injection (True Negative)."""
        code = """
import shlex
def run_ping():
    cmd = request.args['cmd']
    safe_cmd = shlex.quote(cmd)
    os.system("ping -c 1 " + safe_cmd)
"""
        findings = scan_code_ast(code)
        ci = [f for f in findings if f["type"] == "command_injection"]
        self.assertEqual(len(ci), 0, "shlex.quote() must neutralize command injection taint")

    def test_path_sanitizer_basename(self):
        """os.path.basename() / secure_filename() sanitizes path traversal (True Negative)."""
        code = """
import os
def download_file():
    raw_file = request.args['filename']
    safe_file = os.path.basename(raw_file)
    with open("uploads/" + safe_file, "r") as f:
        return f.read()
"""
        findings = scan_code_ast(code)
        pt = [f for f in findings if f["type"] == "path_traversal"]
        self.assertEqual(len(pt), 0, "os.path.basename() must neutralize path traversal taint")

    def test_type_coercion_sanitizer(self):
        """int() type cast sanitizes SQL injection (True Negative)."""
        code = """
def get_user_by_id():
    raw_id = request.args['id']
    safe_id = int(raw_id)
    cursor.execute(f"SELECT * FROM users WHERE id = {safe_id}")
"""
        findings = scan_code_ast(code)
        sqli = [f for f in findings if f["type"] == "sql_injection"]
        self.assertEqual(len(sqli), 0, "int() cast must sanitize SQL injection")

    # --- 3. Tuple & List Unpacking Tests ---

    def test_tuple_unpacking_propagation(self):
        """Tuple unpacking accurately separates tainted from untainted targets."""
        code = """
def handle_unpack():
    tainted_item, safe_item = (request.args['id'], "safe_constant")
    cursor.execute("SELECT * FROM t WHERE a=" + safe_item)
    cursor.execute("SELECT * FROM t WHERE b=" + tainted_item)
"""
        findings = scan_code_ast(code)
        sqli = [f for f in findings if f["type"] == "sql_injection"]
        self.assertEqual(len(sqli), 1, "Only the tainted unpacked target should trigger a finding")
        self.assertIn("tainted_item", sqli[0]["snippet"])

    # --- 4. Scope Shadowing Tests ---

    def test_scope_shadowing_isolation(self):
        """Local assignment does not accidentally mutate global or parent symbol."""
        code = """
query = "SELECT * FROM users"

def func_a():
    query = request.args['q']
    cursor.execute(query)

def func_b():
    # Reads global safe query
    cursor.execute(query)
"""
        findings = scan_code_ast(code)
        sqli = [f for f in findings if f["type"] == "sql_injection"]
        # func_a should have 1 finding, func_b should have 0 findings
        self.assertEqual(len(sqli), 1)
        self.assertEqual(sqli[0]["line"], 6)

    # --- 5. Branch (If-Else) May-Taint Semantics ---

    def test_if_else_may_taint_propagation(self):
        """May-taint: variable tainted in one branch is considered tainted after if-else."""
        code = """
def process_user(flag):
    if flag:
        target = request.args['user']
    else:
        target = "anonymous"
    cursor.execute("SELECT * FROM logs WHERE user=" + target)
"""
        findings = scan_code_ast(code)
        sqli = [f for f in findings if f["type"] == "sql_injection"]
        self.assertEqual(len(sqli), 1, "Variable tainted in branch must trigger May-Taint finding")

    def test_if_else_both_branches_safe(self):
        """If variable is constant in both branches, it remains safe."""
        code = """
def process_user(flag):
    if flag:
        target = "admin"
    else:
        target = "guest"
    cursor.execute("SELECT * FROM logs WHERE user=" + target)
"""
        findings = scan_code_ast(code)
        sqli = [f for f in findings if f["type"] == "sql_injection"]
        self.assertEqual(len(sqli), 0, "Variables constant in both branches must remain untainted")

    # --- 6. Augmented Assignment (+=) Tests ---

    def test_augmented_assignment_propagation(self):
        """Augmented assignment (+=) propagates taint to destination variable."""
        code = """
def build_query():
    q = "SELECT * FROM users WHERE "
    q += request.args['filter']
    cursor.execute(q)
"""
        findings = scan_code_ast(code)
        sqli = [f for f in findings if f["type"] == "sql_injection"]
        self.assertEqual(len(sqli), 1)
        self.assertEqual(sqli[0]["detection_method"], "taint_dataflow")
        self.assertTrue(any("+=" in step for step in sqli[0]["evidence"]["flow"]))

    # --- 7. Command Injection & Path Traversal Baseline ---

    def test_command_injection_tainted(self):
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

    def test_path_traversal_tainted(self):
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

    def test_eval_exec_tainted_provenance(self):
        code = """
def evaluate_math():
    raw_expr = request.args['expr']
    res = eval(raw_expr)
"""
        findings = scan_code_ast(code)
        ev = [f for f in findings if f["type"] == "eval_exec"]
        self.assertEqual(len(ev), 1)
        self.assertEqual(ev[0]["detection_method"], "taint_dataflow")

if __name__ == "__main__":
    unittest.main()
