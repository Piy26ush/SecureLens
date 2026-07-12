from typing import List, Dict, Any

def build_prompt(finding: Dict[str, Any], retrieved_contexts: List[Dict[str, Any]]) -> str:
    """
    Assembles the RAG prompt containing the AST finding details and OWASP guidelines.
    Forces the LLM to output findings matching a structured JSON contract.
    """
    context_str = ""
    for i, ctx in enumerate(retrieved_contexts):
        context_str += f"\n--- Context Chunk #{i+1} ({ctx['title']}) ---\n{ctx['document']}\n"
        
    prompt = f"""
You are a senior security researcher analyzing a Python codebase.
An AST scanner has flagged a potential vulnerability in the code.

Vulnerability Type: {finding['type']}
Line Number: {finding['line']}
Offending Snippet:
{finding['snippet']}

We have retrieved the following OWASP Top 10, OWASP Cheat Sheets, and CWE contexts related to this vulnerability:
{context_str}

Analyze the vulnerability and write an explanation, attack scenario, and a secure fix.
Your output must be a single, raw, valid JSON object matching the schema below:
{{
  "explanation": "A plain English explanation detailing what the vulnerability is, why it is dangerous, and what the fix achieves.",
  "attack_scenario": "A brief explanation (2-3 sentences) of a concrete scenario showing how an attacker could exploit this specific vulnerability.",
  "cwe_id": "{finding['cwe_id']}",
  "owasp_category": "{finding['owasp_id']} - Category Name (derived from context)",
  "severity": "{finding['severity']}",
  "fix_snippet": "The secure Python code snippet that should replace the offending snippet. Output only the secure python code itself, no formatting, markdown code blocks, or comments."
}}
"""
    return prompt

def build_batch_prompt(findings: List[Dict[str, Any]], all_contexts: List[List[Dict[str, Any]]]) -> str:
    """
    Assembles a single combined prompt to explain multiple AST findings in one LLM call.
    """
    findings_str = ""
    for idx, (finding, contexts) in enumerate(zip(findings, all_contexts)):
        context_str = ""
        for i, ctx in enumerate(contexts):
            context_str += f"\n  --- Context Chunk #{i+1} ({ctx['title']}) ---\n  {ctx['document']}\n"
            
        findings_str += f"""
=== Finding #{idx} ===
Vulnerability Type: {finding['type']}
Line Number: {finding['line']}
Severity: {finding['severity']}
Offending Snippet:
{finding['snippet']}

Retrieved Security Context:
{context_str}
======================
"""

    prompt = f"""
You are a senior security researcher analyzing a Python codebase.
An AST scanner has flagged multiple potential vulnerabilities in the code.

Here are the details for each vulnerability:
{findings_str}

For each of the vulnerabilities listed above, analyze the issue and write a detailed explanation, a concrete attack scenario, and a secure code fix.

Your response must be a single, raw, valid JSON object matching the schema below. Output nothing else besides this JSON object (no markdown, no preamble, no block formatting):
{{
  "explanations": [
    {{
      "index": 0,
      "explanation": "A plain English explanation detailing what the vulnerability is, why it is dangerous, and what the fix achieves.",
      "attack_scenario": "A brief explanation (2-3 sentences) of a concrete scenario showing how an attacker could exploit this specific vulnerability.",
      "owasp_category": "The specific OWASP category name derived from context (e.g. 'A03:2021 - Injection')",
      "fix_snippet": "The secure Python code snippet that should replace the offending snippet. Output only the secure python code itself, no markdown code blocks."
    }}
  ]
}}

Ensure that the length of the "explanations" array matches exactly the number of findings ({len(findings)}). Match each explanation to the correct finding using the "index" field.
"""
    return prompt

