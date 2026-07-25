# SecureLens — REST API Reference Manual

The SecureLens backend is a lightweight FastAPI microservice validating all payload communications using strict Pydantic schemas.

---

## 📡 Endpoints

### 1. Health Status Check
*   **Path**: `GET /api/health`
*   **Response Schema** (`HealthResponse`):
    ```json
    {
      "status": "healthy",
      "gemini_configured": true,
      "groq_configured": true
    }
    ```

### 2. Code Security Scan
*   **Path**: `POST /api/scan`
*   **Headers**: `Content-Type: application/json`
*   **Request Schema** (`ScanRequest`):
    ```json
    {
      "code": "import sqlite3\nquery = 'SELECT * FROM users WHERE name = ' + user_input\ncursor.execute(query)"
    }
    ```
*   **Response Schema** (`ScanResponse`):
    ```json
    {
      "success": true,
      "findings": [
        {
          "type": "sql_injection",
          "line": 3,
          "severity": "HIGH",
          "snippet": "cursor.execute(query)",
          "cwe_id": "CWE-89",
          "owasp_id": "A03:2021",
          "explanation": "Direct user input is concatenated into a SQL statement, leading to an Injection flaw...",
          "attack_scenario": "An attacker inputs a payload like 'admin' OR 1=1 to bypass access control.",
          "fix_snippet": "cursor.execute('SELECT * FROM users WHERE name = ?', (user_input,))",
          "owasp_category": "A03:2021 - Injection",
          "source_citation": "OWASP Injection Prevention Cheat Sheet",
          "model_used": "Gemini (gemini-1.5-flash)"
        }
      ],
      "execution_time_ms": 487
    }
    ```

---

## 💻 Sample Integration (cURL)

```bash
curl -X POST "http://localhost:8000/api/scan" \
     -H "Content-Type: application/json" \
     -d '{"code": "eval(input())"}'
```
