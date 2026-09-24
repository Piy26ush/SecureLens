import time
import sys
import os

# Ensure backend can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.scanner.scanner import scan_code_ast

BENCHMARK_CORPUS = [
    # --- TRUE POSITIVES (Expected: FINDING) ---
    {
        "id": "TP_SQLI_DIRECT",
        "category": "sql_injection",
        "expected_vulnerable": True,
        "code": "user = request.args['id']\ncursor.execute('SELECT * FROM u WHERE id=' + user)"
    },
    {
        "id": "TP_SQLI_ALIAS",
        "category": "sql_injection",
        "expected_vulnerable": True,
        "code": "user = request.args['id']\nx = user\ncursor.execute('SELECT * FROM u WHERE id=' + x)"
    },
    {
        "id": "TP_SQLI_MULTISTEP",
        "category": "sql_injection",
        "expected_vulnerable": True,
        "code": "user = request.args['id']\nx = user\nq = 'SELECT * FROM u WHERE id=' + x\ncursor.execute(q)"
    },
    {
        "id": "TP_SQLI_FSTRING",
        "category": "sql_injection",
        "expected_vulnerable": True,
        "code": "user = request.args['id']\nq = f'SELECT * FROM u WHERE id={user}'\ncursor.execute(q)"
    },
    {
        "id": "TP_SQLI_UNPACKED",
        "category": "sql_injection",
        "expected_vulnerable": True,
        "code": "a, b = (request.args['id'], 'safe_val')\ncursor.execute('SELECT * FROM u WHERE id=' + a)"
    },
    {
        "id": "TP_SQLI_MAY_TAINT_IF",
        "category": "sql_injection",
        "expected_vulnerable": True,
        "code": "if condition:\n    q = request.args['user']\nelse:\n    q = 'anonymous'\ncursor.execute('SELECT * FROM u WHERE name=' + q)"
    },
    {
        "id": "TP_SQLI_AUG_ASSIGN",
        "category": "sql_injection",
        "expected_vulnerable": True,
        "code": "q = 'SELECT * FROM u WHERE '\nq += request.args['filter']\ncursor.execute(q)"
    },
    {
        "id": "TP_CMD_DIRECT",
        "category": "command_injection",
        "expected_vulnerable": True,
        "code": "cmd = request.args['cmd']\nos.system('ping ' + cmd)"
    },
    {
        "id": "TP_CMD_SUBPROCESS",
        "category": "command_injection",
        "expected_vulnerable": True,
        "code": "cmd = request.args['cmd']\nx = cmd\nsubprocess.run(x, shell=True)"
    },
    {
        "id": "TP_PATH_OPEN",
        "category": "path_traversal",
        "expected_vulnerable": True,
        "code": "f = request.args['file']\npath = '/var/www/' + f\nopen(path)"
    },
    {
        "id": "TP_EVAL_EXEC",
        "category": "eval_exec",
        "expected_vulnerable": True,
        "code": "expr = request.args['expr']\neval(expr)"
    },

    # --- TRUE NEGATIVES (Expected: SAFE / NO FINDING) ---
    {
        "id": "TN_SQLI_PARAMETERIZED",
        "category": "sql_injection",
        "expected_vulnerable": False,
        "code": "user = request.args['id']\ncursor.execute('SELECT * FROM u WHERE id = ?', (user,))"
    },
    {
        "id": "TN_SQLI_CONSTANT",
        "category": "sql_injection",
        "expected_vulnerable": False,
        "code": "q = 'SELECT * FROM u WHERE active=1'\ncursor.execute(q)"
    },
    {
        "id": "TN_SQLI_REASSIGNED",
        "category": "sql_injection",
        "expected_vulnerable": False,
        "code": "user = request.args['id']\nuser = 'safe_id'\ncursor.execute('SELECT ' + user)"
    },
    {
        "id": "TN_SQLI_TYPE_CAST",
        "category": "sql_injection",
        "expected_vulnerable": False,
        "code": "uid = int(request.args['id'])\ncursor.execute(f'SELECT * FROM u WHERE id = {uid}')"
    },
    {
        "id": "TN_SQLI_UNPACKED_SAFE",
        "category": "sql_injection",
        "expected_vulnerable": False,
        "code": "tainted_val, safe_val = (request.args['id'], 'safe_constant')\ncursor.execute('SELECT * FROM u WHERE a=' + safe_val)"
    },
    {
        "id": "TN_CMD_SHLEX_QUOTE",
        "category": "command_injection",
        "expected_vulnerable": False,
        "code": "import shlex\ncmd = request.args['cmd']\nsafe_cmd = shlex.quote(cmd)\nos.system('ping ' + safe_cmd)"
    },
    {
        "id": "TN_CMD_CONSTANT_LIST",
        "category": "command_injection",
        "expected_vulnerable": False,
        "code": "subprocess.run(['ls', '-la'])"
    },
    {
        "id": "TN_PATH_BASENAME",
        "category": "path_traversal",
        "expected_vulnerable": False,
        "code": "import os\nraw_f = request.args['file']\nsafe_f = os.path.basename(raw_f)\nopen('data/' + safe_f, 'r')"
    },
    {
        "id": "TN_PATH_CONSTANT",
        "category": "path_traversal",
        "expected_vulnerable": False,
        "code": "open('config.json', 'r')"
    },
    {
        "id": "TN_IF_ELSE_BOTH_SAFE",
        "category": "sql_injection",
        "expected_vulnerable": False,
        "code": "if condition:\n    q = 'admin'\nelse:\n    q = 'guest'\ncursor.execute('SELECT * FROM u WHERE name=' + q)"
    }
]

def run_benchmark():
    print("============================================================")
    print("🛡️  SecureLens SAST Engine Benchmark Runner (Hardened V3.0)")
    print("============================================================")

    tp_count = 0
    fp_count = 0
    tn_count = 0
    fn_count = 0

    start_time = time.perf_counter()

    for item in BENCHMARK_CORPUS:
        findings = scan_code_ast(item["code"])
        target_findings = [f for f in findings if f["type"] == item["category"]]
        has_finding = len(target_findings) > 0

        if item["expected_vulnerable"]:
            if has_finding:
                tp_count += 1
                status = "✅ PASS (True Positive)"
            else:
                fn_count += 1
                status = "❌ FAIL (False Negative - Missed Vulnerability)"
        else:
            if not has_finding:
                tn_count += 1
                status = "✅ PASS (True Negative - Correctly Filtered)"
            else:
                fp_count += 1
                status = "❌ FAIL (False Positive - Flagged Safe Code)"

        print(f"[{item['id']:<24}] {item['category']:<18} -> {status}")

    total_time_ms = (time.perf_counter() - start_time) * 1000
    total_cases = len(BENCHMARK_CORPUS)

    precision = tp_count / (tp_count + fp_count) if (tp_count + fp_count) > 0 else 0.0
    recall = tp_count / (tp_count + fn_count) if (tp_count + fn_count) > 0 else 0.0
    f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

    print("\n------------------------------------------------------------")
    print("📊 BENCHMARK METRICS SUMMARY")
    print("------------------------------------------------------------")
    print(f"Total Test Cases      : {total_cases}")
    print(f"True Positives (TP)   : {tp_count}")
    print(f"True Negatives (TN)   : {tn_count}")
    print(f"False Positives (FP)  : {fp_count}")
    print(f"False Negatives (FN)  : {fn_count}")
    print(f"Precision             : {precision * 100:.2f}%")
    print(f"Recall                : {recall * 100:.2f}%")
    print(f"F1 Score              : {f1 * 100:.2f}%")
    print(f"Total Execution Time  : {total_time_ms:.2f} ms")
    print(f"Avg Time per Scan     : {total_time_ms / total_cases:.2f} ms")
    print("============================================================\n")

if __name__ == "__main__":
    run_benchmark()
