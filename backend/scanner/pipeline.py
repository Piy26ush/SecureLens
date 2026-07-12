import os
import json
import urllib.request
import urllib.error
import logging
from typing import List, Dict, Any

from .rules import scan_code_ast
from rag.retriever import retrieve_security_context

# Import centralized configuration parameters
from config import (
    GEMINI_API_KEY, 
    GROQ_API_KEY, 
    GEMINI_MODEL, 
    GROQ_MODEL, 
    TIMEOUT_SECONDS, 
    RETRIEVER_TOP_K
)

# Import prompts from decoupled module
from prompts.security_prompt import build_prompt

# Setup standard logger
logger = logging.getLogger("securelens.pipeline")

def call_gemini_api(prompt: str) -> str:
    """
    Sends request to Gemini using raw HTTP via urllib.
    """
    if not GEMINI_API_KEY:
        raise ValueError("Gemini API Key is missing")

    url = f"https://generativelanguage.googleapis.com/v1/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    
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
            logger.error(f"Gemini API error body: {error_body}")
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
    Dual-Provider LLM Client with Automatic Fallback (High Availability).
    Tries Gemini first, falls back to Groq if Gemini fails or is unconfigured.
    Returns (response_text, model_name_used).
    """
    # 1. Try Gemini (Primary)
    if GEMINI_API_KEY:
        try:
            logger.info(f"Sending request to primary provider: {GEMINI_MODEL}")
            return call_gemini_api(prompt), f"Gemini ({GEMINI_MODEL})"
        except Exception as e:
            logger.warning(f"Gemini API call failed: {e}. Trying fallback provider...")
            
    # 2. Try Groq (Fallback)
    if GROQ_API_KEY:
        try:
            logger.info(f"Sending request to fallback provider: {GROQ_MODEL}")
            return call_groq_api(prompt), f"Groq ({GROQ_MODEL})"
        except Exception as e:
            logger.error(f"Groq API call failed: {e}.")
            
    # 3. Ultimate Offline Fallback: If both fail or are missing, raise error
    raise RuntimeError("No operational LLM provider available. Check your API keys.")

def run_scan_pipeline(code: str) -> List[Dict[str, Any]]:
    """
    Main pipeline: Scan code for AST findings, query VSM for context, 
    call LLM for explanations, and merge output findings.
    """
    findings = scan_code_ast(code)
    
    # If there are no findings or syntax errors, return early
    if not findings or (len(findings) == 1 and findings[0]["type"] == "syntax_error"):
        return findings

    enriched_findings = []
    for finding in findings:
        # Check if LLM keys are present. If not, generate a basic offline template finding
        if not GEMINI_API_KEY and not GROQ_API_KEY:
            logger.info(f"No API keys configured. Using offline fallback for finding: {finding['type']}")
            finding_copy = finding.copy()
            finding_copy["explanation"] = f"Flagged potential {finding['type']}. Please configure API keys (GEMINI_API_KEY or GROQ_API_KEY) in your environment variables to receive detailed AI explanations."
            finding_copy["attack_scenario"] = f"An attacker could target the system by triggering inputs designed to invoke the unsafe AST pattern matched in {finding['type']}."
            finding_copy["fix_snippet"] = "# LLM API Keys unconfigured. Dynamic fix snippet unavailable."
            finding_copy["owasp_category"] = f"{finding['owasp_id']} Category"
            finding_copy["source_citation"] = "AST Rules Engine"
            finding_copy["model_used"] = "Offline Fallback"
            enriched_findings.append(finding_copy)
            continue

        try:
            # Query vector store for guidelines
            contexts = retrieve_security_context(finding["type"], category=finding["type"], top_k=RETRIEVER_TOP_K)
            prompt = build_prompt(finding, contexts)
            
            # Call Gemini / Groq Llama
            llm_response_str, model_used = call_llm(prompt)
            
            # Parse JSON response
            llm_data = json.loads(llm_response_str)
            
            # Merge AST finding metadata with AI-written details
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
        except Exception as e:
            # Handle pipeline failures gracefully
            logger.error(f"Failed to enrich finding {finding['type']}: {e}")
            fallback_finding = finding.copy()
            fallback_finding["explanation"] = f"Failed to enrich finding: {str(e)}"
            fallback_finding["attack_scenario"] = "Failed to compile attack scenario: backend pipeline error."
            fallback_finding["fix_snippet"] = "# Fallback fix: check logs"
            fallback_finding["owasp_category"] = f"{finding['owasp_id']} Category"
            fallback_finding["source_citation"] = "AST Local Fallback"
            fallback_finding["model_used"] = "None (Error)"
            enriched_findings.append(fallback_finding)

    return enriched_findings
