import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";
import { AlertTriangle, Activity, FileCode2, Timer } from "lucide-react";

function useCount(target: number, duration = 0.9) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0");
  const rounded = useTransform(mv, (v) => (Number.isInteger(target) ? Math.round(v).toString() : v.toFixed(2)));
  useEffect(() => {
    const controls = animate(mv, target, { duration, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [target, duration, mv, rounded]);
  return display;
}

function riskTone(score: number) {
  if (score >= 75) return { color: "text-red-400", ring: "ring-red-500/20", bar: "bg-red-500" };
  if (score >= 50) return { color: "text-orange-400", ring: "ring-orange-500/20", bar: "bg-orange-500" };
  if (score >= 25) return { color: "text-amber-400", ring: "ring-amber-500/20", bar: "bg-amber-500" };
  return { color: "text-emerald-400", ring: "ring-emerald-500/20", bar: "bg-emerald-500" };
}

interface Props {
  riskScore: number;
  totalFindings: number;
  linesScanned: number;
  executionMs: number;
  networkMs?: number;
}

export function MetricsCards({ riskScore, totalFindings, linesScanned, executionMs, networkMs }: Props) {
  const risk = useCount(riskScore);
  const total = useCount(totalFindings);
  const lines = useCount(linesScanned);
  const exec = useCount(executionMs);
  const tone = riskTone(riskScore);

  const cards = [
    {
      label: "Risk Score",
      value: risk,
      suffix: "/100",
      icon: AlertTriangle,
      color: tone.color,
      ring: tone.ring,
      progress: Math.min(100, Math.max(0, riskScore)),
      bar: tone.bar,
    },
    { label: "Total Findings", value: total, icon: Activity, color: "text-indigo-400", ring: "ring-indigo-500/20" },
    { label: "Lines Scanned", value: lines, icon: FileCode2, color: "text-slate-300", ring: "ring-slate-500/20" },
    {
      label: "Execution Time",
      value: exec,
      suffix: "ms",
      icon: Timer,
      color: "text-slate-300",
      ring: "ring-slate-500/20",
      breakdown: networkMs !== undefined ? { backend: executionMs, network: networkMs } : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}
            className={`rounded-xl border border-[#21262d] bg-slate-900/60 p-4 ring-1 ${c.ring}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                {c.label}
              </span>
              <Icon className={`h-4 w-4 ${c.color}`} />
            </div>
            <div className={`mt-2 font-mono text-2xl font-semibold tabular-nums ${c.color}`}>
              {c.value}
              {c.suffix && <span className="ml-0.5 text-sm text-slate-500">{c.suffix}</span>}
            </div>
            {"progress" in c && c.progress !== undefined && (
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.progress}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className={`h-full ${c.bar}`}
                />
              </div>
            )}
            {"breakdown" in c && c.breakdown && (
              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-[#21262d] pt-2">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-600 block">Backend</span>
                  <span className="text-slate-400 font-semibold">{c.breakdown.backend} ms</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-wider text-slate-600 block">Network</span>
                  <span className="text-slate-400 font-semibold">{c.breakdown.network} ms</span>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
