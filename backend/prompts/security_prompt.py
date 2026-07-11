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
