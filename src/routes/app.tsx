import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Trash2, ShieldCheck, Loader2, FolderOpen, Download, FileText } from "lucide-react";

import { Header } from "@/components/dashboard/Header";
import { DemoButtons } from "@/components/dashboard/DemoButtons";
import { CodeEditor } from "@/components/dashboard/CodeEditor";
import { PipelineLoader } from "@/components/dashboard/PipelineLoader";
import { EmptyState, SafeScanState } from "@/components/dashboard/EmptyState";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { FindingsList } from "@/components/dashboard/FindingsList";
import { Footer } from "@/components/dashboard/Footer";
import { DEMOS } from "@/lib/demos";
import { scanCode, scanProject, exportPdfReport, type ScanResponse } from "@/lib/api";

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

interface UploadedFile {
  path: string;
  content: string;
}

function SecureLensPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [code, setCode] = useState("");
  const [projectFiles, setProjectFiles] = useState<UploadedFile[] | null>(null);
  const [projectName, setProjectName] = useState("SecureProject");
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);

  const [view, setView] = useState<ViewState>("idle");
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [networkMs, setNetworkMs] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!mounted) {
    return <div className="min-h-screen bg-slate-950 text-slate-200" />;
  }

  const loadDemo = (kind: keyof typeof DEMOS) => {
    setProjectFiles(null);
    setCode(DEMOS[kind]);
    setResult(null);
    setView("idle");
  };

  const clear = () => {
    setCode("");
    setProjectFiles(null);
    setResult(null);
    setView("idle");
  };

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setView("idle");
    setResult(null);
    
    toast.info(`Reading ${files.length} files...`);
    const loaded: UploadedFile[] = [];
    
    for (const file of files) {
      // Only parse Python files
      if (file.name.endsWith(".py")) {
        try {
          const content = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (evt) => resolve((evt.target?.result as string) || "");
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(file);
          });
          
          loaded.push({
            path: file.webkitRelativePath || file.name,
            content
          });
        } catch (err) {
          console.error(`Error reading ${file.name}:`, err);
        }
      }
    }

    if (loaded.length === 0) {
      toast.error("No Python files found", { description: "Select folder/files containing .py source files." });
      return;
    }

    setProjectFiles(loaded);
    setSelectedFileIdx(0);
    
    // Resolve project/folder name
    const firstPath = files[0].webkitRelativePath || files[0].name;
    const folder = firstPath.split("/")[0] || "CodebaseScope";
    setProjectName(folder);
    
    toast.success(`Loaded ${loaded.length} Python files`, { description: `Project Name: ${folder}` });
  };

  const scan = async () => {
    const isProject = projectFiles && projectFiles.length > 0;
    
    if (!isProject && !code.trim()) {
      toast.error("No code to scan", { description: "Paste Python code or upload a folder codebase." });
      return;
    }

    setView("scanning");
    setFinished(false);
    setResult(null);
    const startedAt = performance.now();

    try {
      let data: ScanResponse;
      if (isProject && projectFiles) {
        data = await scanProject(projectName, projectFiles);
      } else {
        data = await scanCode(code);
      }

      const totalElapsed = performance.now() - startedAt;
      const backendMs = data.execution_time_ms ?? 0;
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

  const downloadPdfReport = async () => {
    if (!result) return;
    const findings = result.findings ?? [];
    
    try {
      toast.info("Generating PDF report...");
      const blob = await exportPdfReport(
        projectName,
        findings,
        result.risk_score,
        result.lines_scanned,
        result.execution_time_ms
      );
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_security_report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success("Security PDF downloaded successfully!");
    } catch (err) {
      toast.error("Failed to export PDF", { description: (err as Error).message });
    }
  };

  const findings = result?.findings ?? [];
  const total = result?.total ?? findings.length;
  const isBusy = view === "scanning";
  const isProjectActive = projectFiles && projectFiles.length > 0;

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

            <div className="flex items-center justify-between">
              <div>
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Demo Examples
                </div>
                <DemoButtons onLoad={loadDemo} disabled={isBusy} />
              </div>
              
              <div className="text-right">
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFolderUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isBusy}
                  className="mt-4 flex items-center gap-1.5 rounded-lg border border-[#21262d] bg-indigo-500/10 border-indigo-500/30 px-3 py-1.5 text-xs font-semibold text-indigo-400 transition-all hover:bg-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  Upload Folder
                </button>
              </div>
            </div>

            <div className="flex min-h-[380px] flex-1 flex-col">
              {isProjectActive && projectFiles ? (
                <div className="flex flex-1 flex-col gap-3 lg:flex-row overflow-hidden max-h-[440px]">
                  {/* File tree sidebar */}
                  <div className="w-full lg:w-1/3 border border-[#21262d] rounded-xl bg-slate-950 p-2 overflow-y-auto flex flex-col gap-1 max-h-[140px] lg:max-h-none">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1 flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Files ({projectFiles.length})
                    </div>
                    {projectFiles.map((file, idx) => (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFileIdx(idx)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-mono truncate border transition-all ${
                          idx === selectedFileIdx
                            ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-300"
                            : "border-transparent text-slate-400 hover:bg-slate-900"
                        }`}
                      >
                        {file.path}
                      </button>
                    ))}
                  </div>
                  {/* Editor for selected file */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="text-[10px] font-mono text-slate-500 mb-1 truncate px-1">
                      Editing: <span className="text-slate-300 font-semibold">{projectFiles[selectedFileIdx].path}</span>
                    </div>
                    <div className="flex-1 flex flex-col min-h-0">
                      <CodeEditor
                        value={projectFiles[selectedFileIdx].content}
                        onChange={(val) => {
                          const updated = [...projectFiles];
                          updated[selectedFileIdx] = { ...updated[selectedFileIdx], content: val };
                          setProjectFiles(updated);
                        }}
                        disabled={isBusy}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <CodeEditor value={code} onChange={setCode} disabled={isBusy} />
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clear}
                disabled={isBusy}
                className="flex items-center gap-2 rounded-lg border border-[#21262d] bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-red-500/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Clear
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
                    Scanning {isProjectActive ? "Project" : "Code"}…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Scan {isProjectActive ? "Project" : "Code"}
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
                    <div className="mb-2 flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-slate-100">
                        Security Report: <span className="text-indigo-400 font-mono font-medium">{projectName}</span>
                      </h2>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={downloadPdfReport}
                          className="rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-400 flex items-center gap-1.5 transition-all"
                        >
                          <Download className="h-3.5 w-3.5" />
                          PDF Report
                        </button>
                        <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-300">
                          Ready
                        </span>
                      </div>
                    </div>
                    <MetricsCards
                      riskScore={getRiskScoreNumber(result.risk_score)}
                      totalFindings={Number(total ?? 0)}
                      linesScanned={Number(result.lines_scanned ?? 0)}
                      executionMs={Number(result.execution_time_ms ?? 0)}
                      networkMs={networkMs}
                      filesScanned={result.files_scanned}
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
