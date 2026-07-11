# Version 1.0 Refactoring & Refinement Explanation

This document details the clean software engineering improvements implemented in SecureLens Version 1.0 to make it production-ready and structured for resumes/interviews.

---

## 1. Centralized Configuration (`config.py`)
*   **What we did**: Created [config.py](file:///Users/piyush/Desktop/SecureLens/backend/config.py) to manage all environmental configuration data.
*   **Why we did it**: Previously, environment keys, model strings (like `"gemini-1.5-flash"`), and settings (like timeouts and search parameters) were scattered across different files. Centralizing them ensures we only have to change settings in a single place to adjust backend behaviors.

---

## 2. Decoupled Prompts (`prompts/security_prompt.py`)
*   **What we did**: Extracted the LLM prompt formatting templates out of the code pipeline and moved them to [security_prompt.py](file:///Users/piyush/Desktop/SecureLens/backend/prompts/security_prompt.py).
*   **Why we did it**: Prompts are long, complex text specifications. Mixing prompt layouts with the logical code execution loops clutter the pipeline's logic. Decoupling prompts makes both the instructions and the pipeline code highly readable.

---

## 3. Standardized Python logging (`logging`)
*   **What we did**: Configured Python's native `logging` module and replaced raw `print()` statements with `logger.info`, `logger.warning`, and `logger.error` tags in [main.py](file:///Users/piyush/Desktop/SecureLens/backend/main.py) and [pipeline.py](file:///Users/piyush/Desktop/SecureLens/backend/scanner/pipeline.py).
*   **Why we did it**: In production web applications, stdout `print()` statements are hard to filter and do not include timestamps or log levels. Standardized logging is crucial for runtime debugging, audit tracking, and filtering critical errors in hosting services (like Railway or AWS CloudWatch).

---

## 4. FastAPI Pydantic Response Models (`main.py`)
*   **What we did**: Defined strict Pydantic schemas (`ScanRequest`, `FindingModel`, `ScanResponse`, `HealthResponse`) to validate FastAPI request and response data structures.
*   **Why we did it**: 
    1.  **Validation**: It guarantees that the backend returns perfectly formatted JSON matching the contract, preventing front-end parsing failures.
    2.  **Interactive Swagger Docs**: It automatically populates the FastAPI Swagger UI (`/docs`) with structured input/output JSON schemas, allowing developers to see models instantly and click to run test payloads.
