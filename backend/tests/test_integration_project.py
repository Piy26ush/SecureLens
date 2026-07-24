"""
FastAPI Test Client Script for SecureLens V2.0 Phase 3
Tests: scan-project, export-report, stats, and models endpoints.
"""

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from fastapi.testclient import TestClient
from backend.main import app

def run_integration_tests():
    print("=" * 70)
    print("🧪 SecureLens V2.0 — Phase 3 Backend Integration Tests")
    print("=" * 70)

    client = TestClient(app)

    # 1. Mock project files payload
    project_payload = {
        "project_name": "DemoPortal",
        "files": [
            {
                "path": "app.py",
                "content": """import os
import hashlib

def main():
    # Vulnerability 1: Hardcoded Secret
    SECRET_KEY = "AQ.Ab8RN6LkYV3XjLhOmKS3y"
    
    # Vulnerability 2: Weak Crypto
    h = hashlib.md5()
    h.update(b"test")
    print(h.hexdigest())
"""
            },
            {
                "path": "database.py",
                "content": """def fetch_user(db_conn, username):
    # Vulnerability 3: SQL Injection
    query = "SELECT * FROM users WHERE name = '" + username + "'"
    db_conn.execute(query)
"""
            }
        ]
    }

    # 2. Test scan-project endpoint
    print("🔄 Testing POST /api/scan-project ...")
    scan_response = client.post("/api/scan-project", json=project_payload)
    if scan_response.status_code != 200:
        print(f"❌ Failed /api/scan-project: {scan_response.text}")
        return
    
    scan_data = scan_response.json()
    print(f"✅ Success! Risk Score: {scan_data['risk_score']} | Total Findings: {scan_data['total']}")
    print(f"   Lines Scanned: {scan_data['lines_scanned']} | Files Scanned: {scan_data['files_scanned']}")
    print(f"   Execution Duration: {scan_data['execution_time_ms']} ms")
    
    for idx, f in enumerate(scan_data["findings"], 1):
        print(f"   [{idx}] {f['file_path']}:{f['line']} | {f['severity']} | {f['type']}")
        print(f"       Snippet: {f['snippet']}")
        print(f"       Source: {f['source_citation']}")
    print("-" * 65)

    # 3. Test export-report endpoint
    print("🔄 Testing POST /api/export-report (PDF Generation) ...")
    export_payload = {
        "project_name": "DemoPortal",
        "findings": scan_data["findings"],
        "risk_score": scan_data["risk_score"],
        "lines_scanned": scan_data["lines_scanned"],
        "execution_time_ms": scan_data["execution_time_ms"]
    }
    
    export_response = client.post("/api/export-report", json=export_payload)
    if export_response.status_code != 200:
        print(f"❌ Failed /api/export-report: {export_response.text}")
        return
        
    # Write test report inside backend/tests directory to keep root clean
    pdf_path = os.path.join(os.path.dirname(__file__), "test_report.pdf")
    with open(pdf_path, "wb") as f:
        f.write(export_response.content)
    print(f"✅ Success! PDF Security Report written to: {pdf_path}")
    print("-" * 65)

    # 4. Test stats endpoint
    print("🔄 Testing GET /api/stats ...")
    stats_response = client.get("/api/stats")
    if stats_response.status_code == 200:
        stats_data = stats_response.json()
        print(f"✅ Success! Total Scans Run: {stats_data['total_scans_run']}")
        print(f"   Average Risk Score: {stats_data['average_risk_score']}")
        print(f"   Findings Severity Map: {stats_data['findings_by_severity']}")
    else:
        print(f"❌ Failed /api/stats: {stats_response.text}")
    print("-" * 65)

    # 5. Test models endpoint
    print("🔄 Testing GET /api/models ...")
    models_response = client.get("/api/models")
    if models_response.status_code == 200:
        models_data = models_response.json()
        print(f"✅ Success! Cascade Timeout: {models_data['timeout_seconds']}s")
        print(f"   Primary LLM: {models_data['active_cascade'][0]['name']}")
        print(f"   Fallback: {models_data['fallback_provider']}")
    else:
        print(f"❌ Failed /api/models: {models_response.text}")

    print("=" * 70)
    print("🎉 Integration Verification Run Completed Successfully!")
    print("=" * 70)

if __name__ == "__main__":
    run_integration_tests()
