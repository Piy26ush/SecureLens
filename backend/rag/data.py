# Curated Security Knowledge Base for RAG (OWASP & CWE Chunks)
# Each chunk contains document text and metadata for filtering.

SECURITY_KNOWLEDGE_BASE = [
    # SQL Injection Chunks
    {
        "id": "owasp-sqli-01",
        "category": "sql_injection",
        "source": "owasp_top10",
        "cwe_id": "CWE-89",
        "owasp_id": "A03:2021",
        "title": "OWASP Top 10 - SQL Injection Prevention",
        "document": """
SQL Injection (SQLi) occurs when untrusted user input is directly concatenated into SQL queries. 
To prevent SQL Injection, developers must use Parameterized Queries (also known as Prepared Statements). 
Parameterized queries ensure that the database treats user input strictly as data, never as executable code. 
Example of secure parameterization in Python:
cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (user, password))
Never use f-strings or string addition (+) to inject variables into cursor.execute() calls.
"""
    },
    {
        "id": "owasp-sqli-02",
        "category": "sql_injection",
        "source": "cheat_sheet",
        "cwe_id": "CWE-89",
        "owasp_id": "A03:2021",
        "title": "OWASP SQL Injection Prevention Cheat Sheet",
        "document": """
Primary Prevention: Use of Prepared Statements (Parameterized Queries).
If database drivers do not support prepared statements, input validation using strict allow-lists is required. 
All numeric fields should be cast to integer or float before database queries are executed.
Stored procedures can also prevent SQLi if they parameterized arguments internally, but dynamic SQL inside stored procedures is still vulnerable.
Escaping user inputs is a secondary defense and should not be relied upon as the sole defense mechanism.
"""
    },
    {
        "id": "cwe-sqli-03",
        "category": "sql_injection",
        "source": "cwe",
        "cwe_id": "CWE-89",
        "owasp_id": "A03:2021",
        "title": "CWE-89: Improper Neutralization of Special Elements used in an SQL Command",
        "document": """
CWE-89 describes vulnerabilities where software constructs SQL commands using input from upstream sources without verifying or neutralizing the input.
This allows attackers to manipulate the structure of the SQL query, leading to unauthorized data access, modification, or execution of database administrative commands.
The main mitigation is separating the query structure from the data parameters (using SQL parameter placeholders).
"""
    },

    # Command Injection Chunks
    {
        "id": "owasp-cmd-01",
        "category": "command_injection",
        "source": "owasp_top10",
        "cwe_id": "CWE-78",
        "owasp_id": "A03:2021",
        "title": "OWASP Top 10 - Command Injection",
        "document": """
Command Injection occurs when application code passes unvalidated input directly to a system shell (e.g., via os.system or shell=True in subprocess).
To prevent command injection, avoid shell execution entirely. If running system commands is required, pass arguments as a list of static values and disable the shell parser:
Secure Example:
subprocess.run(["ping", "-c", "1", ip_address], shell=False)
This prevents command concatenation using separators like ;, &&, or ||.
"""
    },
    {
        "id": "owasp-cmd-02",
        "category": "command_injection",
        "source": "cheat_sheet",
        "cwe_id": "CWE-78",
        "owasp_id": "A03:2021",
        "title": "OWASP OS Command Injection Prevention",
        "document": """
Mitigation Strategies:
1. Avoid executing shell commands directly. Use built-in Python library functions (e.g., os.mkdir() instead of os.system("mkdir ...")).
2. If shell commands are required, perform strict validation of input against an allow-list (regex matching alphanumeric values only).
3. Do not use shell=True in Python's subprocess module. Run executable paths directly, and pass parameters as independent list entries.
"""
    },
    {
        "id": "cwe-cmd-03",
        "category": "command_injection",
        "source": "cwe",
        "cwe_id": "CWE-78",
        "owasp_id": "A03:2021",
        "title": "CWE-78: OS Command Injection",
        "document": """
The software constructs an OS command using externally-influenced input, but it does not neutralize special characters that could modify the command sent to the operating system.
This allows attackers to execute arbitrary shell commands under the privileges of the running application.
Mitigations include escaping shell metadata (though fragile) or avoiding executing processes through the shell shell context.
"""
    },

    # Path Traversal Chunks
    {
        "id": "owasp-path-01",
        "category": "path_traversal",
        "source": "owasp_top10",
        "cwe_id": "CWE-22",
        "owasp_id": "A01:2021",
        "title": "OWASP Top 10 - Path Traversal Prevention",
        "document": """
Path Traversal (or Directory Traversal) allows attackers to read or write files outside the intended web root folder by injecting input containing '../' sequences.
Prevention:
1. Sanitize input paths using os.path.basename() to extract only the filename.
2. Resolve absolute paths using os.path.abspath() and verify that the target path begins with the allowed base directory.
Secure Example:
resolved_path = os.path.abspath(os.path.join(BASE_DIR, user_input))
if not resolved_path.startswith(BASE_DIR):
    raise PermissionError("Access Denied")
"""
    },
    {
        "id": "cwe-path-02",
        "category": "path_traversal",
        "source": "cwe",
        "cwe_id": "CWE-22",
        "owasp_id": "A01:2021",
        "title": "CWE-22: Improper Limitation of a Pathname to a Restricted Directory",
        "document": """
The application uses external input to construct pathnames that are intended to identify files or directories under a restricted directory, but it does not neutralize directory separators like '/' or '\' or '../'.
This exposes sensitive configuration files, logs, or system libraries to unauthorized access or overwrite.
Mitigations involve strict character allow-lists and path canonicalization (resolving links and checking path prefixes).
"""
    },

    # Deserialization Chunks
    {
        "id": "owasp-deser-01",
        "category": "pickle_loads",
        "source": "owasp_top10",
        "cwe_id": "CWE-502",
        "owasp_id": "A08:2021",
        "title": "OWASP Top 10 - Software and Data Integrity Failures",
        "document": """
Untrusted deserialization occurs when data is converted back into an object without validation. 
In Python, the pickle module is highly vulnerable: loading a pickle stream can execute arbitrary shell commands built into the pickled data.
Never use pickle.loads() on untrusted user data.
Mitigation: Use safe serialization formats like JSON, Protocol Buffers, or YAML (using yaml.safe_load()).
"""
    },
    {
        "id": "cwe-deser-02",
        "category": "pickle_loads",
        "source": "cwe",
        "cwe_id": "CWE-502",
        "owasp_id": "A08:2021",
        "title": "CWE-502: Deserialization of Untrusted Data",
        "document": """
CWE-502 describes vulnerabilities where applications deserialize untrusted data without sufficient verification of the resulting object.
This can allow attackers to instantiate unexpected objects or execute code embedded within the serialized stream.
 Mitigations: Avoid serialization frameworks that permit arbitrary object instantiation, sign serialized payloads with HMAC to verify integrity, or use data-only formats (like JSON).
"""
    },

    # Hardcoded Secrets Chunks
    {
        "id": "owasp-secret-01",
        "category": "hardcoded_secret",
        "source": "owasp_top10",
        "cwe_id": "CWE-798",
        "owasp_id": "A07:2021",
        "title": "OWASP Top 10 - Identification and Authentication Failures",
        "document": """
Hardcoding credentials, API tokens, or passwords directly in source code allows anyone with access to the codebase (or compiled files) to compromise downstream systems.
Prevention:
Store secrets in environment variables (.env files) or external Secret Managers (e.g. AWS Secrets Manager, HashiCorp Vault).
Read variables in Python using os.environ:
api_key = os.environ.get("API_KEY")
Always add your config/env files to .gitignore to prevent committing secrets to source control.
"""
    },
    {
        "id": "cwe-secret-02",
        "category": "cwe",
        "cwe_id": "CWE-798",
        "owasp_id": "A07:2021",
        "title": "CWE-798: Use of Hardcoded Credentials",
        "document": """
The software contains hardcoded credentials, such as a password or cryptographic key, which it uses for inbound authentication, outbound communication, or encryption.
If the credential gets exposed, the system is fully compromised, and replacing credentials requires shipping new code.
Mitigation: Load secrets from environmental configuration systems at runtime.
"""
    },

    # eval / exec Chunks
    {
        "id": "owasp-eval-01",
        "category": "eval_exec",
        "source": "owasp_top10",
        "cwe_id": "CWE-95",
        "owasp_id": "A03:2021",
        "title": "OWASP Code Injection Prevention",
        "document": """
The eval() and exec() functions compile and execute string arguments as Python code at runtime.
If user input reaches these calls, the attacker gains full control over the execution context and can run any Python code (e.g., calling import os; os.system()).
Mitigation: Avoid eval/exec. For configuration evaluations, use ast.literal_eval() which only parses safe data structures (lists, dicts, constants) and cannot run functions.
"""
    }
]
