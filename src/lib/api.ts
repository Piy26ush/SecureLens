export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

export type Severity = "critical" | "high" | "medium" | "low";

export interface Finding {
  severity: Severity | string;
  name?: string;
  vulnerability?: string;
  title?: string;
  line?: number | null;
  line_number?: number | null;
  ai_explanation?: string | null;
  explanation?: string | null;
  what_happened?: string | null;
  why_dangerous?: string | null;
  why_fix_works?: string | null;
  attack_scenario?: string | null;
  vulnerable_code?: string | null;
  secure_fix?: string | null;
  fix?: string | null;
  cwe?: string | null;
  owasp?: string | null;
  source?: string | null;
  citation?: string | null;
  [k: string]: unknown;
}

export interface ScanResponse {
  risk_score?: number;
  total_findings?: number;
  total?: number;
  lines_scanned?: number;
  execution_time?: number;
  execution_time_ms?: number;
  findings?: Finding[];
  [k: string]: unknown;
}

export async function scanCode(code: string, signal?: AbortSignal): Promise<ScanResponse> {
  const res = await fetch(`${API_URL}/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
