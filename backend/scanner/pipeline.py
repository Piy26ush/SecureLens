import os
import json
import urllib.request
import urllib.error
import logging
from typing import List, Dict, Any

from .scanner import scan_code_ast

try:
    from backend.rag.retriever import retrieve_security_context
    from backend.config import (
        GEMINI_API_KEY, 
        GROQ_API_KEY, 
        GEMINI_MODEL, 
        GROQ_MODEL, 
        TIMEOUT_SECONDS, 
        RETRIEVER_TOP_K
    )
    from backend.prompts.security_prompt import build_prompt, build_batch_prompt
except ImportError:
    from rag.retriever import retrieve_security_context
    from config import (
        GEMINI_API_KEY, 
        GROQ_API_KEY, 
        GEMINI_MODEL, 
        GROQ_MODEL, 
        TIMEOUT_SECONDS, 
        RETRIEVER_TOP_K
    )
    from prompts.security_prompt import build_prompt, build_batch_prompt

# Setup standard logger
logger = logging.getLogger("securelens.pipeline")

def call_gemini_api(prompt: str, model_name: str = None) -> str:
    """
    Sends request to Gemini using raw HTTP via urllib.
    """
    if not GEMINI_API_KEY:
        raise ValueError("Gemini API Key is missing")

    target_model = model_name if model_name else GEMINI_MODEL
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{target_model}:generateContent?key={GEMINI_API_KEY}"
    
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
    
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            return res_data["candidates"][0]["content"]["parts"][0]["text"]
    except urllib.error.HTTPError as e:
        try:
            error_body = e.read().decode('utf-8')
            logger.error(f"Gemini API ({target_model}) error body: {error_body}")
        except Exception:
            pass
        raise e

def call_groq_api(prompt: str) -> str:
    """
    Sends request to Groq API using raw HTTP via urllib, parameterized via config.
    Returns JSON response string from model.
    """
    if not GROQ_API_KEY:
        raise ValueError("Groq API Key is missing")

    url = "https://api.groq.com/openai/v1/chat/completions"
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You are a Python security audit system. Output strict JSON only."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "response_format": {"type": "json_object"}
    }
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
    
    with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        return res_data["choices"][0]["message"]["content"]

def call_llm(prompt: str) -> tuple[str, str]:
    """
    Multi-model Gemini Cascade with Cross-Provider Groq Fallback.
    Tries Gemini models sequentially (GEMINI_MODEL, gemini-3.6-flash, gemini-3.5-flash, gemini-3.5-flash-lite, gemini-2.0-flash)
    to bypass model-specific rate limits or service outages, and falls back to Groq if all fail.
    """
    if GEMINI_API_KEY:
        # Determine unique models list in priority order
        model_candidates = []
        seen = set()
        for m in [GEMINI_MODEL, "gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-2.0-flash"]:
            if m and m not in seen:
                seen.add(m)
                model_candidates.append(m)

        for model in model_candidates:
            try:
                logger.info(f"Attempting primary provider: Gemini ({model})")
                return call_gemini_api(prompt, model), f"Gemini ({model})"
            except Exception as e:
                logger.warning(f"Gemini model {model} failed: {e}. Trying next cascade model...")
                
    # 2. Try Groq (Fallback)
    if GROQ_API_KEY:
        try:
            logger.info(f"Sending request to fallback provider: {GROQ_MODEL}")
            return call_groq_api(prompt), f"Groq ({GROQ_MODEL})"
        except Exception as e:
            logger.error(f"Groq API call failed: {e}.")
            
    # 3. Ultimate Fallback: raise error
    raise RuntimeError("No operational LLM provider available. Check your API keys.")

def run_scan_pipeline(code: str) -> List[Dict[str, Any]]:
    """
    Main pipeline: Scan code for AST findings, query VSM for context, 
    call LLM for explanations, and merge output findings in a single batched API call.
    """
    findings = scan_code_ast(code)
    
    # If there are no findings or syntax errors, return early
    if not findings or (len(findings) == 1 and findings[0]["type"] == "syntax_error"):
        return findings

    # Check if LLM keys are present. If not, generate a basic offline template finding
    if not GEMINI_API_KEY and not GROQ_API_KEY:
        logger.info("No API keys configured. Using offline fallback for all findings.")
        enriched_findings = []
        for finding in findings:
            finding_copy = finding.copy()
            finding_copy["explanation"] = f"Flagged potential {finding['type']}. Please configure API keys (GEMINI_API_KEY or GROQ_API_KEY) in your environment variables to receive detailed AI explanations."
            finding_copy["attack_scenario"] = f"An attacker could target the system by triggering inputs designed to invoke the unsafe AST pattern matched in {finding['type']}."
            finding_copy["fix_snippet"] = "# LLM API Keys unconfigured. Dynamic fix snippet unavailable."
            finding_copy["owasp_category"] = f"{finding['owasp_id']} Category"
            finding_copy["source_citation"] = "AST Rules Engine"
            finding_copy["model_used"] = "Offline Fallback"
            enriched_findings.append(finding_copy)
        return enriched_findings

    # 1. Retrieve contexts for all findings
    all_contexts = []
    for finding in findings:
        contexts = retrieve_security_context(finding["type"], category=finding["type"], top_k=RETRIEVER_TOP_K)
        all_contexts.append(contexts)

    # 2. Build a combined batch prompt
    batch_prompt = build_batch_prompt(findings, all_contexts)
    
    try:
        # 3. Call Gemini / Groq Llama once
        llm_response_str, model_used = call_llm(batch_prompt)
        
        # 4. Clean markdown code blocks if present and parse JSON response
        clean_json = llm_response_str.strip()
        if clean_json.startswith("```"):
            lines = clean_json.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].startswith("```"):
                lines = lines[:-1]
            clean_json = "\n".join(lines).strip()
            
        llm_data = json.loads(clean_json)
        explanations_list = llm_data.get("explanations", [])
        
        # Build index lookup map
        explanations_by_index = {}
        for item in explanations_list:
            if isinstance(item, dict) and "index" in item:
                explanations_by_index[int(item["index"])] = item
                
        # 5. Merge each AST finding with its respective explanation
        enriched_findings = []
        for idx, finding in enumerate(findings):
            explanation_data = explanations_by_index.get(idx)
            contexts = all_contexts[idx]
            
            enriched_finding = finding.copy()
            if explanation_data:
                enriched_finding.update({
                    "explanation": explanation_data.get("explanation", "Vulnerability detected."),
                    "attack_scenario": explanation_data.get("attack_scenario", "No attack scenario provided."),
                    "fix_snippet": explanation_data.get("fix_snippet", "# No fix provided."),
                    "owasp_category": explanation_data.get("owasp_category", f"{finding['owasp_id']} Category"),
                    "source_citation": contexts[0]["title"] if contexts else "OWASP Reference",
                    "model_used": model_used
                })
            else:
                # Local fallback for missing index
                enriched_finding.update({
                    "explanation": f"Flagged potential {finding['type']}. Explanation could not be structured by LLM batch pipeline.",
                    "attack_scenario": "Exploitation depends on application input handling.",
                    "fix_snippet": "# Review code alignment manually.",
                    "owasp_category": f"{finding['owasp_id']} Category",
                    "source_citation": contexts[0]["title"] if contexts else "AST Local Fallback",
                    "model_used": model_used
                })
            enriched_findings.append(enriched_finding)
        return enriched_findings

    except Exception as e:
        logger.error(f"Failed to run batched LLM scan pipeline: {e}. Falling back to individual requests.")
        
        enriched_findings = []
        for idx, finding in enumerate(findings):
            contexts = all_contexts[idx]
            try:
                single_prompt = build_prompt(finding, contexts)
                llm_response_str, model_used = call_llm(single_prompt)
                clean_json_single = llm_response_str.strip()
                if clean_json_single.startswith("```"):
                    lines_single = clean_json_single.splitlines()
                    if lines_single[0].startswith("```"):
                        lines_single = lines_single[1:]
                    if lines_single[-1].startswith("```"):
                        lines_single = lines_single[:-1]
                    clean_json_single = "\n".join(lines_single).strip()
                llm_data = json.loads(clean_json_single)
                
                enriched_finding = finding.copy()
                enriched_finding.update({
                    "explanation": llm_data.get("explanation", "Vulnerability detected."),
                    "attack_scenario": llm_data.get("attack_scenario", "No attack scenario provided."),
                    "fix_snippet": llm_data.get("fix_snippet", "# No fix provided."),
                    "owasp_category": llm_data.get("owasp_category", f"{finding['owasp_id']} Category"),
                    "source_citation": contexts[0]["title"] if contexts else "OWASP Reference",
                    "model_used": model_used
                })
                enriched_findings.append(enriched_finding)
            except Exception as inner_e:
                logger.error(f"Failed individual fallback check for {finding['type']}: {inner_e}")
                fallback_finding = finding.copy()
                fallback_finding.update({
                    "explanation": f"Vulnerability explanation unavailable: {str(inner_e)}",
                    "attack_scenario": "Exploitation details omitted due to API limit or error.",
                    "fix_snippet": "# Check backend logs",
                    "owasp_category": f"{finding['owasp_id']} Category",
                    "source_citation": "AST Local Fallback",
                    "model_used": "None (Error)"
                })
                enriched_findings.append(fallback_finding)
        return enriched_findings

def run_project_scan_pipeline(files: List[Dict[str, str]]) -> List[Dict[str, Any]]:
    """
    Scans multiple project files recursively, aggregates findings,
    optimizes AI token usage by caching explanations by vulnerability type,
    and returns a combined enriched findings list.
    """
    logger.info(f"Starting project scan pipeline for {len(files)} files.")
    
    # 1. Run AST rules on each file
    all_findings = []
    for f in files:
        path = f.get("path", "unknown_file.py")
        content = f.get("content", "")
        
        # Parse and scan
        file_findings = scan_code_ast(content)
        for finding in file_findings:
            # Map path and file name
            finding_copy = finding.copy()
            finding_copy["file_path"] = path
            all_findings.append(finding_copy)

    # If no findings or only syntax errors, return early
    if not all_findings:
        return []

    # 2. Extract unique vulnerability types to optimize LLM calls
    unique_vuln_types = list(set(finding["type"] for finding in all_findings if finding["type"] != "syntax_error"))
    
    # Check if LLM keys are configured
    if not GEMINI_API_KEY and not GROQ_API_KEY:
        logger.info("No API keys configured. Using offline fallback for all project findings.")
        enriched_findings = []
        for finding in all_findings:
            finding_copy = finding.copy()
            finding_copy["explanation"] = f"Flagged potential {finding['type']}. Please configure API keys (GEMINI_API_KEY or GROQ_API_KEY) in your environment variables to receive detailed AI explanations."
            finding_copy["attack_scenario"] = f"An attacker could target the system by triggering inputs designed to invoke the unsafe AST pattern matched in {finding['type']}."
            finding_copy["fix_snippet"] = "# LLM API Keys unconfigured. Dynamic fix snippet unavailable."
            finding_copy["owasp_category"] = f"{finding.get('owasp_id', 'N/A')} Category"
            finding_copy["source_citation"] = "AST Rules Engine"
            finding_copy["model_used"] = "Offline Fallback"
            enriched_findings.append(finding_copy)
        return enriched_findings

    # 3. Retrieve context and query LLM once per unique vulnerability type
    cached_explanations = {}
    
    for vuln_type in unique_vuln_types:
        try:
            # Retrieve RAG context
            contexts = retrieve_security_context(vuln_type, category=vuln_type, top_k=RETRIEVER_TOP_K)
            
            # Find the first finding of this type to use as the prompt example
            example_finding = next(f for f in all_findings if f["type"] == vuln_type)
            
            single_prompt = build_prompt(example_finding, contexts)
            llm_response_str, model_used = call_llm(single_prompt)
            
            clean_json = llm_response_str.strip()
            if clean_json.startswith("```"):
                lines = clean_json.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines[-1].startswith("```"):
                    lines = lines[:-1]
                clean_json = "\n".join(lines).strip()
                
            llm_data = json.loads(clean_json)
            cached_explanations[vuln_type] = {
                "explanation": llm_data.get("explanation", "Vulnerability detected."),
                "attack_scenario": llm_data.get("attack_scenario", "No attack scenario provided."),
                "fix_snippet": llm_data.get("fix_snippet", "# No fix provided."),
                "owasp_category": llm_data.get("owasp_category", f"{example_finding.get('owasp_id', 'N/A')} Category"),
                "source_citation": contexts[0]["title"] if contexts else "OWASP Reference",
                "model_used": model_used
            }
        except Exception as e:
            logger.error(f"Failed to generate explanation for unique type {vuln_type}: {e}")
            example_finding = next(f for f in all_findings if f["type"] == vuln_type)
            cached_explanations[vuln_type] = {
                "explanation": f"Flagged potential {vuln_type}. Detailed AI explanation timed out or failed.",
                "attack_scenario": "Exploitation depends on application configuration and sanitization.",
                "fix_snippet": "# Check backend logs",
                "owasp_category": f"{example_finding.get('owasp_id', 'N/A')} Category",
                "source_citation": "AST Local Fallback",
                "model_used": "Offline Fallback (Error)"
            }

    # 4. Map the cached explanations back to all occurrences
    enriched_findings = []
    for finding in all_findings:
        vuln_type = finding["type"]
        enriched_finding = finding.copy()
        
        if vuln_type == "syntax_error":
            enriched_finding.update({
                "explanation": "Code contains syntax errors and cannot be successfully parsed by the Python compiler.",
                "attack_scenario": "Syntax errors do not present direct vulnerability vectors but break operational code integrity.",
                "fix_snippet": "# Fix syntax errors manually.",
                "owasp_category": "N/A",
                "source_citation": "Python Compiler",
                "model_used": "Static Parser"
            })
        elif vuln_type in cached_explanations:
            enriched_finding.update(cached_explanations[vuln_type])
        else:
            enriched_finding.update({
                "explanation": f"Flagged potential {vuln_type}.",
                "attack_scenario": "No attack scenario available.",
                "fix_snippet": "# Review code manually.",
                "owasp_category": f"{finding.get('owasp_id', 'N/A')} Category",
                "source_citation": "AST Local Fallback",
                "model_used": "None"
            })
        enriched_findings.append(enriched_finding)
        
    return enriched_findings
