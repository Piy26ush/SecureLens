# Phase 3: LLM Integration & API Completion Explanation

This document contains the detailed explanation of what we built in Phase 3, why we built it, and the technical concepts behind it.

---

## 1. High Availability: Dual LLM Client with Fallback
For a real-life deployed project, we cannot rely on a single third-party API. If that provider is down or hits rate limits, our application goes offline. 

To solve this, we implemented a **Primary + Fallback LLM client wrapper** inside [backend/scanner/pipeline.py](file:///Users/piyush/Desktop/SecureLens/backend/scanner/pipeline.py):
1.  **Primary Provider (Gemini)**: If `GEMINI_API_KEY` is present in the environment variables, the system routes all security enrichment requests to Google's Gemini 1.5 Flash model.
2.  **Fallback Provider (Groq / Llama 3.1)**: If a request to Gemini fails (e.g. rate limit error or connection timeout), the system catches the error and automatically resubmits it to Groq's high-speed LPU hosting Llama 3.1 70B.
3.  **Graceful Offline Mode**: If no API keys are present (or the machine is offline), the scanner doesn't crash! It falls back to a local rules-based catalog that provides pre-written template security explanations and fixes. This makes development and offline demos smooth.

---

## 2. Dynamic prompt Building (RAG Injection)
To write grounded, non-hallucinated explanations, the LLM prompt is assembled dynamically:
*   **AST Input**: The scanner provides the vulnerability name (e.g. `sql_injection`), line number, and the offending code string.
*   **VSM RAG Input**: The retriever searches the database and returns the top 2 matching OWASP or CWE prevention guidelines.
*   **System Instructions**: We direct the LLM to output a strict JSON structure containing the explanation, CWE mapping, OWASP mapping, severity, and a secure code replacement.
*   **Why JSON?**: A standard text output is hard for a computer program to parse. By forcing the LLM to return strict JSON, our FastAPI backend can load it directly as a dictionary and send it to our React frontend as clean data attributes.

---

## 3. Lightweight HTTP Requests (Zero SDK Dependencies)
Instead of importing heavy SDK packages (`google-generativeai` or `groq`) which add bloat and require extra compilation/network installs, we used Python's native standard library modules:
*   `urllib.request` and `json`
*   **Why?**: This ensures that we make HTTP requests directly to the API endpoints using standard JSON payloads. It has zero dependencies, making the backend start up instantly and run on any machine.

---

## 4. Hooking it to the API endpoint
In [backend/main.py](file:///Users/piyush/Desktop/SecureLens/backend/main.py), we updated the `/api/scan` route:
1.  It receives the source code from the frontend.
2.  Runs the scanning pipeline which executes AST checks, retrieves OWASP guidelines, and generates AI explanations.
3.  Calculates an overall **risk score** (CRITICAL, HIGH, MEDIUM, LOW) based on the highest severity finding found.
4.  Returns the JSON payload back to the frontend.
