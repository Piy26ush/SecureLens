import sys
import os
import logging
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure backend imports work if run directly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scanner.pipeline import run_scan_pipeline

# Initialize standard logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("securelens.api")

app = FastAPI(title="Securelens API", version="1.0.0")

# Enable CORS (Cross-Origin Resource Sharing) so our frontend can query the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic API Models ---

class ScanRequest(BaseModel):
    code: str = Field(..., description="Source code to scan for security vulnerabilities")
    language: Optional[str] = Field("python", description="Target programming language")

class FindingModel(BaseModel):
    type: str = Field(..., description="The vulnerability classifier key (e.g. sql_injection)")
    line: int = Field(..., description="The line number where the issue was detected")
    severity: str = Field(..., description="The computed severity level (CRITICAL, HIGH, MEDIUM, LOW)")
    snippet: str = Field(..., description="The code snippet containing the security flaw")
    cwe_id: Optional[str] = Field(None, description="Common Weakness Enumeration ID mapping")
    owasp_id: Optional[str] = Field(None, description="OWASP Top 10 rule ID mapping")
    owasp_category: Optional[str] = Field(None, description="OWASP Top 10 group mapping")
    explanation: Optional[str] = Field(None, description="Detailed explanation of the issue and why it is dangerous")
    attack_scenario: Optional[str] = Field(None, description="Exploitation scenario explanation")
    fix_snippet: Optional[str] = Field(None, description="Secure code snippet replacement")
    source_citation: Optional[str] = Field(None, description="Cited standards document reference")
    model_used: Optional[str] = Field(None, description="The AI model used to generate this finding description")

class ScanResponse(BaseModel):
    findings: List[FindingModel] = Field(..., description="List of detected vulnerabilities and details")
    total: int = Field(..., description="Total number of findings discovered")
    risk_score: str = Field(..., description="Overall project safety score based on highest severity")
    lines_scanned: int = Field(..., description="Total line count of scanned input code")

class HealthResponse(BaseModel):
    status: str = Field(..., description="Current server state indicator")
    message: str = Field(..., description="Status messages details")

# --- API Endpoints ---

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint to monitor API status."""
    logger.info("Health check endpoint hit.")
    return {"status": "ok", "message": "Securelens service is running"}

@app.post("/api/scan", response_model=ScanResponse)
def scan_code(request: ScanRequest):
    """Scans code for vulnerabilities using local AST scanner, VSM RAG context, and LLM explanation."""
    logger.info(f"Incoming scan request. Code length: {len(request.code)} characters.")
    
    if not request.code.strip():
        logger.warning("Empty source code submitted for scanning.")
        raise HTTPException(status_code=400, detail="Source code cannot be empty")
    
    try:
        findings = run_scan_pipeline(request.code)
        
        # Calculate overall risk score based on the highest severity finding
        risk_score = "LOW"
        severities = [f.get("severity") for f in findings if "severity" in f]
        
        if "CRITICAL" in severities:
            risk_score = "CRITICAL"
        elif "HIGH" in severities:
            risk_score = "HIGH"
        elif "MEDIUM" in severities:
            risk_score = "MEDIUM"
            
        logger.info(f"Scan complete. Total findings: {len(findings)}. Risk score: {risk_score}")
        
        return {
            "findings": findings,
            "total": len(findings),
            "risk_score": risk_score,
            "lines_scanned": len(request.code.splitlines())
        }
    except Exception as e:
        logger.critical(f"Unhandled error in scan endpoint pipeline: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal scan pipeline failure: {str(e)}")
