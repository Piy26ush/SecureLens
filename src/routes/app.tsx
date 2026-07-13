import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Trash2, ShieldCheck, Loader2 } from "lucide-react";

import { Header } from "@/components/securelens/Header";
import { DemoButtons } from "@/components/securelens/DemoButtons";
import { CodeEditor } from "@/components/securelens/CodeEditor";
import { PipelineLoader } from "@/components/securelens/PipelineLoader";
import { EmptyState, SafeScanState } from "@/components/securelens/EmptyState";
import { MetricsCards } from "@/components/securelens/MetricsCards";
import { FindingsList } from "@/components/securelens/FindingsList";
import { Footer } from "@/components/securelens/Footer";
import { DEMOS } from "@/lib/demos";
import { scanCode, type ScanResponse } from "@/lib/api";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "SecureLens — AI-Assisted Secure Code Auditor" },
      {
        name: "description",
        content:
          "Enterprise-grade Python security auditor powered by deterministic AST analysis, OWASP/CWE knowledge and AI explanations.",
      },
      { property: "og:title", content: "SecureLens — AI-Assisted Secure Code Auditor" },
      {
        property: "og:description",
        content:
          "Scan Python code for injection, traversal and misuse vulnerabilities with AST-grounded, AI-explained findings.",
      },
    ],
  }),
  component: SecureLensPage,
});

type ViewState = "idle" | "scanning" | "result";

function SecureLensPage() {
  const [code, setCode] = useState("");
  const [view, setView] = useState<ViewState>("idle");
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [networkMs, setNetworkMs] = useState(0);

  const loadDemo = (kind: keyof typeof DEMOS) => {
    setCode(DEMOS[kind]);
    setResult(null);
    setView("idle");
  };

  const clear = () => {
    setCode("");
    setResult(null);
    setView("idle");
  };

  const scan = async () => {
    if (!code.trim()) {
      toast.error("No code to scan", { description: "Paste Python code or load a demo example." });
      return;
    }
    setView("scanning");
    setFinished(false);
    setResult(null);
    const startedAt = performance.now();
    try {
      const data = await scanCode(code);
      const totalElapsed = performance.now() - startedAt;
      const backendMs = data.execution_time_ms ?? data.execution_time ?? 0;
      const netMs = Math.max(0, Math.round(totalElapsed - backendMs));
      setNetworkMs(netMs);

      // Minimum pipeline time for premium feel
      const elapsed = performance.now() - startedAt;
      const minMs = 2400;
      if (elapsed < minMs) {
        await new Promise((r) => setTimeout(r, minMs - elapsed));
      }
      setFinished(true);
      await new Promise((r) => setTimeout(r, 550));
      setResult(data);
      setView("result");
    } catch (err) {
      const e = err as Error & { status?: number };
      const title =
        e.status === 400
          ? "Invalid request"
          : e.status === 422
          ? "Could not parse code"
          : e.status === 500
          ? "Scanner error"
          : "Scan failed";
      toast.error(title, {
        description: e.message || "Please try again.",
        action: { label: "Retry", onClick: () => scan() },
      });
      setView("idle");
    }
  };

  const findings = result?.findings ?? [];
  const total = result?.total_findings ?? result?.total ?? findings.length;
  const isBusy = view === "scanning";

  const getRiskScoreNumber = (score: string | undefined): number => {
    if (!score) return 0;
    const s = score.toLowerCase();
    if (s === "critical") return 100;
    if (s === "high") return 75;
    if (s === "medium") return 45;
    if (s === "low") return 0;
    return 0;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 antialiased">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex min-h-screen flex-col"
      >
        <div className="flex flex-1 flex-col gap-4 p-4 lg:flex-row lg:gap-5 lg:p-6">
          {/* LEFT PANEL — 45% */}
          <section className="flex min-h-[560px] flex-col gap-4 rounded-2xl border border-[#21262d] bg-slate-900/40 p-4 backdrop-blur lg:min-h-0 lg:w-[45%] lg:p-5">
            <Header />

            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Demo Examples
              </div>
              <DemoButtons onLoad={loadDemo} disabled={isBusy} />
            </div>

            <div className="flex min-h-[380px] flex-1 flex-col">
              <CodeEditor value={code} onChange={setCode} disabled={isBusy} />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clear}
                disabled={isBusy}
                className="flex items-center gap-2 rounded-lg border border-[#21262d] bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-red-500/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear Code
              </button>
              <motion.button
                onClick={scan}
                disabled={isBusy}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:from-indigo-400 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {isBusy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Scanning…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Scan Code
                  </>
                )}
              </motion.button>
            </div>
          </section>

          {/* RIGHT PANEL — 55% */}
          <section className="flex min-h-[560px] flex-1 flex-col overflow-hidden rounded-2xl border border-[#21262d] bg-slate-900/40 backdrop-blur lg:min-h-0">
            <AnimatePresence mode="wait">
              {view === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1"
                >
                  <EmptyState />
                </motion.div>
              )}

              {view === "scanning" && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1"
                >
                  <PipelineLoader running finished={finished} />
                </motion.div>
              )}

              {view === "result" && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-1 flex-col overflow-hidden"
                >
                  <div className="border-b border-[#21262d] px-5 py-4">
                    <div className="mb-1 flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-slate-100">Security Report</h2>
                      <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-300">
                        Ready
                      </span>
                    </div>
                    <MetricsCards
                      riskScore={getRiskScoreNumber(result.risk_score ? String(result.risk_score) : undefined)}
                      totalFindings={Number(total ?? 0)}
                      linesScanned={Number(result.lines_scanned ?? code.split("\n").length)}
                      executionMs={Number(result.execution_time_ms ?? result.execution_time ?? 0)}
                      networkMs={networkMs}
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto px-5 py-4 [scrollbar-width:thin]">
                    {total === 0 ? (
                      <SafeScanState />
                    ) : (
                      <>
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Findings ({findings.length})
                          </h3>
                          <span className="text-[11px] text-slate-500">Sorted by severity</span>
                        </div>
                        <FindingsList findings={findings} />
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        <Footer />
      </motion.main>
    </div>
  );
}
