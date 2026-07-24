import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChevronDown, AlertOctagon, Zap, BookOpen, ExternalLink } from "lucide-react";
import type { Finding, Severity } from "@/lib/api";
import { CodeComparison } from "./CodeComparison";

const SEV_STYLES: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
  critical: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/30",
    dot: "bg-red-500",
    label: "Critical",
  },
  high: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/30",
    dot: "bg-orange-500",
    label: "High",
  },
  medium: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    dot: "bg-amber-500",
    label: "Medium",
  },
  low: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    dot: "bg-emerald-500",
    label: "Low",
  },
};

export function severityRank(sev: string): number {
  const s = sev?.toLowerCase();
  if (s === "critical") return 0;
  if (s === "high") return 1;
  if (s === "medium") return 2;
  if (s === "low") return 3;
  return 4;
}

interface Props {
  finding: Finding;
  index: number;
  defaultOpen?: boolean;
}

export function FindingCard({ finding, index, defaultOpen }: Props) {
  const [open, setOpen] = useState(!!defaultOpen);
  const sevKey = String(finding.severity ?? "low").toLowerCase();
  const sev = SEV_STYLES[sevKey] ?? SEV_STYLES.low;
  const name =
    (finding.type as string) ||
    (finding.name as string) ||
    (finding.vulnerability as string) ||
    (finding.title as string) ||
    "Security Finding";
  const line = finding.line ?? finding.line_number ?? null;
  const explanation =
    finding.explanation ||
    finding.ai_explanation ||
    [finding.what_happened, finding.why_dangerous, finding.why_fix_works].filter(Boolean).join("\n\n") ||
    null;
  const attack = finding.attack_scenario ?? null;
  const vulnerable = finding.snippet ?? finding.vulnerable_code ?? null;
  const secure = finding.fix_snippet ?? finding.secure_fix ?? finding.fix ?? null;
  const cwe = finding.cwe_id ?? finding.cwe ?? null;
  const owasp = finding.owasp_category ?? finding.owasp_id ?? finding.owasp ?? null;
  const source = finding.source_citation ?? finding.source ?? finding.citation ?? null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`overflow-hidden rounded-xl border ${sev.border} bg-slate-900/60 backdrop-blur`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-900"
      >
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border ${sev.border} ${sev.bg} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${sev.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} />
          {sev.label}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-100">{name}</span>
        {line != null && (
          <span className="rounded-md border border-[#21262d] bg-slate-950 px-2 py-0.5 font-mono text-[11px] text-slate-400">
            L{line}
          </span>
        )}
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-slate-400">
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="space-y-5 border-t border-[#21262d] px-4 py-4">
              {explanation && (
                <section>
                  <div className="flex items-center justify-between mb-2">
                    <SectionTitle icon={<BookOpen className="h-3.5 w-3.5" />}>AI Explanation</SectionTitle>
                    {finding.model_used && (
                      <span className="text-[10px] font-mono text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 rounded-md tracking-wide">
                        ⚡ {finding.model_used}
                      </span>
                    )}
                  </div>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">{explanation}</p>
                </section>
              )}

              {attack && (
                <section>
                  <SectionTitle icon={<Zap className="h-3.5 w-3.5 text-orange-400" />}>Attack Scenario</SectionTitle>
                  <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3 text-sm leading-relaxed text-slate-300">
                    {attack}
                  </div>
                </section>
              )}

              {(vulnerable || secure) && (
                <section>
                  <SectionTitle icon={<AlertOctagon className="h-3.5 w-3.5" />}>Code Comparison</SectionTitle>
                  <CodeComparison vulnerable={vulnerable} secure={secure} />
                </section>
              )}

              {(cwe || owasp || source) && (
                <section>
                  <SectionTitle icon={<ExternalLink className="h-3.5 w-3.5" />}>References</SectionTitle>
                  <div className="flex flex-wrap gap-1.5">
                    {cwe && <RefBadge label="CWE" value={cwe} color="indigo" />}
                    {owasp && <RefBadge label="OWASP" value={owasp} color="violet" />}
                    {source && <RefBadge label="Source" value={source} color="slate" />}
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
      {icon} {children}
    </div>
  );
}

function RefBadge({ label, value, color }: { label: string; value: string; color: "indigo" | "violet" | "slate" }) {
  const styles = {
    indigo: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:border-indigo-500/60 hover:bg-indigo-500/15",
    violet: "border-violet-500/30 bg-violet-500/10 text-violet-300 hover:border-violet-500/60 hover:bg-violet-500/15",
    slate: "border-[#21262d] bg-slate-800/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800",
  }[color];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${styles}`}
    >
      <span className="text-[10px] uppercase tracking-wider opacity-70">{label}</span>
      <span className="font-mono">{value}</span>
    </span>
  );
}
