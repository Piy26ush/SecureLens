let baseApiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

if (typeof window !== "undefined" && baseApiUrl.includes("localhost")) {
  const hostname = window.location.hostname;
  if (hostname !== "localhost" && hostname !== "127.0.0.1" && !hostname.endsWith(".vercel.app")) {
    baseApiUrl = baseApiUrl.replace("localhost", hostname);
  }
}

export const API_URL = baseApiUrl;

export type Severity = "critical" | "high" | "medium" | "low";

export interface Finding {
  type: string;
  line: number;
  file_path?: string;
  severity: Severity | string;
  snippet: string;
  cwe_id?: string | null;
  owasp_id?: string | null;
  owasp_category?: string | null;
  explanation?: string | null;
  attack_scenario?: string | null;
  fix_snippet?: string | null;
  source_citation?: string | null;
  model_used?: string | null;
}

export interface ScanResponse {
  findings: Finding[];
  total: number;
  risk_score: string;
  lines_scanned: number;
  files_scanned?: number;
  execution_time_ms: number;
}

export interface StatsResponse {
  total_scans_run: number;
  average_risk_score: string;
  findings_by_severity: Record<string, number>;
}

// User Session ID Isolation Helper (Option A)
export function getUserId(): string {
  if (typeof window === "undefined") return "default_user";
  let uid = localStorage.getItem("securelens_user_id");
  if (!uid) {
    uid = "usr_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("securelens_user_id", uid);
  }
  return uid;
}

export async function scanCode(code: string, signal?: AbortSignal): Promise<ScanResponse> {
  const res = await fetch(`${API_URL}/api/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-ID": getUserId()
    },
    body: JSON.stringify({ code }),
    signal,
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.detail) detail = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail);
    } catch {
      /* ignore */
    }
    const err = new Error(detail) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  return res.json();
}

export async function scanProject(
  projectName: string,
  files: { path: string; content: string }[],
  signal?: AbortSignal
): Promise<ScanResponse> {
  const res = await fetch(`${API_URL}/api/scan-project`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-ID": getUserId()
    },
    body: JSON.stringify({ project_name: projectName, files }),
    signal,
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.detail) detail = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail);
    } catch {
      /* ignore */
    }
    const err = new Error(detail) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  return res.json();
}

export async function fetchStats(signal?: AbortSignal): Promise<StatsResponse> {
  const res = await fetch(`${API_URL}/api/stats`, {
    method: "GET",
    headers: {
      "X-User-ID": getUserId()
    },
    signal,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch stats (${res.status})`);
  }

  return res.json();
}

export async function exportPdfReport(
  projectName: string,
  findings: Finding[],
  riskScore: string,
  linesScanned: number,
  executionTimeMs: number
): Promise<Blob> {
  const res = await fetch(`${API_URL}/api/export-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-ID": getUserId()
    },
    body: JSON.stringify({
      project_name: projectName,
      findings,
      risk_score: riskScore,
      lines_scanned: linesScanned,
      execution_time_ms: executionTimeMs
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to generate PDF report (${res.status})`);
  }

  return res.blob();
}
