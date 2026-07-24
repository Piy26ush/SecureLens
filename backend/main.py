import sys
import os
import logging
import time
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Response, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure backend imports work if run directly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from scanner.pipeline import run_scan_pipeline, run_project_scan_pipeline
from utils.pdf_generator import generate_pdf_report
from config import GEMINI_MODEL, GROQ_MODEL, TIMEOUT_SECONDS

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("securelens.api")

app = FastAPI(title="SecureLens API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Transient in-memory analytics engine mapped by User Session ID
stats_store: Dict[str, Dict[str, Any]] = {}

def get_user_stats(user_id: Optional[str]) -> Dict[str, Any]:
    uid = user_id if (user_id and user_id != "null" and user_id != "undefined") else "default_user"
    if uid not in stats_store:
        stats_store[uid] = {
            "total_scans_run": 0,
            "severity_distribution": {
                "CRITICAL": 0,
                "HIGH": 0,
                "MEDIUM": 0,
                "LOW": 0
            }
        }
    return stats_store[uid]

# --- Pydantic API Models ---

class ScanRequest(BaseModel):
    code: str = Field(..., description="Source code to scan for security vulnerabilities")
    language: Optional[str] = Field("python", description="Target programming language")

class ProjectFile(BaseModel):
    path: str = Field(..., description="Relative file path within the project")
    content: str = Field(..., description="Full source code text content of the file")

class ProjectScanRequest(BaseModel):
    project_name: str = Field("SecureProject", description="Name of the scanned project")
    files: List[ProjectFile] = Field(..., description="List of source files in the project payload")

class FindingModel(BaseModel):
    type: str
    line: int
    file_path: Optional[str] = "source.py"
    severity: str
    snippet: str
    cwe_id: Optional[str] = None
    owasp_id: Optional[str] = None
    owasp_category: Optional[str] = None
    explanation: Optional[str] = None
    attack_scenario: Optional[str] = None
    fix_snippet: Optional[str] = None
    source_citation: Optional[str] = None
    model_used: Optional[str] = None

class ScanResponse(BaseModel):
    findings: List[FindingModel]
    total: int
    risk_score: str
    lines_scanned: int
    files_scanned: Optional[int] = 1
    execution_time_ms: int

class ExportRequest(BaseModel):
    project_name: str
    findings: List[FindingModel]
    risk_score: str
    lines_scanned: int
    execution_time_ms: int

class StatsResponse(BaseModel):
    total_scans_run: int
    average_risk_score: str
    findings_by_severity: Dict[str, int]

class ModelCascadeInfo(BaseModel):
    name: str
    role: str
    status: str

class ModelListResponse(BaseModel):
    active_cascade: List[ModelCascadeInfo]
    fallback_provider: str
    timeout_seconds: int

class HealthResponse(BaseModel):
    status: str
    message: str

# Helper to resolve overall risk score
def compute_risk_score(findings: List[Any]) -> str:
    severities = [f.get("severity") if isinstance(f, dict) else f.severity for f in findings]
    if "CRITICAL" in severities:
        return "CRITICAL"
    elif "HIGH" in severities:
        return "HIGH"
    elif "MEDIUM" in severities:
        return "MEDIUM"
    return "LOW"

# --- Endpoints ---

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    return {"status": "ok", "message": "Securelens service is running"}

@app.post("/api/scan", response_model=ScanResponse)
def scan_code(request: ScanRequest, x_user_id: Optional[str] = Header(None)):
    logger.info(f"Incoming single scan request. Code length: {len(request.code)} characters.")
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Source code cannot be empty")
    
    start_time = time.perf_counter()
    try:
        findings = run_scan_pipeline(request.code)
        risk_score = compute_risk_score(findings)
        
        # Track analytics per user
        user_stats = get_user_stats(x_user_id)
        user_stats["total_scans_run"] += 1
        for f in findings:
            sev = f.get("severity", "LOW")
            if sev in user_stats["severity_distribution"]:
                user_stats["severity_distribution"][sev] += 1
                
        end_time = time.perf_counter()
        execution_time_ms = int((end_time - start_time) * 1000)
        
        return {
            "findings": findings,
            "total": len(findings),
            "risk_score": risk_score,
            "lines_scanned": len(request.code.splitlines()),
            "files_scanned": 1,
            "execution_time_ms": execution_time_ms
        }
    except Exception as e:
        logger.critical(f"Unhandled error in scan API: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/scan-project", response_model=ScanResponse)
def scan_project(request: ProjectScanRequest, x_user_id: Optional[str] = Header(None)):
    logger.info(f"Incoming project scan request: '{request.project_name}'. Files count: {len(request.files)}")
    if not request.files:
        raise HTTPException(status_code=400, detail="Project payload must contain files")
    
    start_time = time.perf_counter()
    try:
        # Convert Pydantic objects to dicts
        files_dict = [{"path": f.path, "content": f.content} for f in request.files]
        findings = run_project_scan_pipeline(files_dict)
        risk_score = compute_risk_score(findings)
        
        # Track analytics per user
        user_stats = get_user_stats(x_user_id)
        user_stats["total_scans_run"] += 1
        for f in findings:
            sev = f.get("severity", "LOW")
            if sev in user_stats["severity_distribution"]:
                user_stats["severity_distribution"][sev] += 1
                
        total_lines = sum(len(f.content.splitlines()) for f in request.files)
        end_time = time.perf_counter()
        execution_time_ms = int((end_time - start_time) * 1000)
        
        return {
            "findings": findings,
            "total": len(findings),
            "risk_score": risk_score,
            "lines_scanned": total_lines,
            "files_scanned": len(request.files),
            "execution_time_ms": execution_time_ms
        }
    except Exception as e:
        logger.critical(f"Unhandled error in project scan API: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/export-report")
def export_report(request: ExportRequest):
    logger.info(f"Incoming PDF export request for project: '{request.project_name}'")
    try:
        # Convert Finding Pydantic models back to standard dicts
        findings_dicts = []
        for f in request.findings:
            findings_dicts.append({
                "type": f.type,
                "line": f.line,
                "file_path": f.file_path,
                "severity": f.severity,
                "snippet": f.snippet,
                "cwe_id": f.cwe_id,
                "owasp_id": f.owasp_id,
                "explanation": f.explanation,
                "attack_scenario": f.attack_scenario,
                "fix_snippet": f.fix_snippet,
                "source_citation": f.source_citation,
                "model_used": f.model_used
            })
            
        pdf_bytes = generate_pdf_report(
            project_name=request.project_name,
            findings=findings_dicts,
            risk_score=request.risk_score,
            lines_scanned=request.lines_scanned,
            execution_time_ms=request.execution_time_ms
        )
        
        filename = f"{request.project_name.lower().replace(' ', '_')}_security_report.pdf"
        headers = {
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
        return Response(content=pdf_bytes, media_type="application/pdf", headers=headers)
        
    except Exception as e:
        logger.critical(f"Unhandled error in PDF exporter: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats", response_model=StatsResponse)
def get_stats(x_user_id: Optional[str] = Header(None)):
    # Resolve transient average risk based on severity ratios per user
    user_stats = get_user_stats(x_user_id)
    sev_dist = user_stats["severity_distribution"]
    avg_score = "LOW"
    if sev_dist["CRITICAL"] > 0:
        avg_score = "CRITICAL"
    elif sev_dist["HIGH"] > 0:
        avg_score = "HIGH"
    elif sev_dist["MEDIUM"] > 0:
        avg_score = "MEDIUM"
        
    return {
        "total_scans_run": user_stats["total_scans_run"],
        "average_risk_score": avg_score,
        "findings_by_severity": sev_dist
    }

@app.get("/api/models", response_model=ModelListResponse)
def get_models():
    return {
        "active_cascade": [
            {"name": GEMINI_MODEL, "role": "Primary LLM Provider", "status": "ACTIVE"},
            {"name": "gemini-3.6-flash", "role": "First Priority Fallback", "status": "ACTIVE"},
            {"name": "gemini-3.5-flash", "role": "Second Priority Fallback", "status": "ACTIVE"},
            {"name": "gemini-3.5-flash-lite", "role": "Third Priority Fallback", "status": "ACTIVE"},
            {"name": "gemini-2.0-flash", "role": "Fourth Priority Fallback", "status": "ACTIVE"}
        ],
        "fallback_provider": f"Groq ({GROQ_MODEL})",
        "timeout_seconds": TIMEOUT_SECONDS
    }
