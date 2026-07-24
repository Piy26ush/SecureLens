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
  if (score >= 75) return { color: "text-red-400", bar: "bg-red-500", glow: "bg-red-500/20" };
  if (score >= 50) return { color: "text-orange-400", bar: "bg-orange-500", glow: "bg-orange-500/20" };
  if (score >= 25) return { color: "text-amber-400", bar: "bg-amber-500", glow: "bg-amber-500/20" };
  return { color: "text-emerald-400", bar: "bg-emerald-500", glow: "bg-emerald-500/20" };
}

interface Props {
  riskScore: number;
  totalFindings: number;
  linesScanned: number;
  executionMs: number;
  networkMs?: number;
  filesScanned?: number;
}

export function MetricsCards({ riskScore, totalFindings, linesScanned, executionMs, networkMs, filesScanned }: Props) {
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
      glow: tone.glow,
      progress: Math.min(100, Math.max(0, riskScore)),
      bar: tone.bar,
    },
    {
      label: "Findings",
      value: total,
      icon: Activity,
      color: "text-[#6366F1]",
      glow: "bg-[#6366F1]/15",
    },
    {
      label: "Lines Scanned",
      value: lines,
      icon: FileCode2,
      color: "text-[#fdfdfd]",
      glow: "bg-white/[0.05]",
      breakdown: filesScanned !== undefined && filesScanned > 1 ? { files: filesScanned } : undefined,
    },
    {
      label: "Execution",
      value: exec,
      suffix: "ms",
      icon: Timer,
      color: "text-[#fdfdfd]",
      glow: "bg-white/[0.05]",
      breakdown: networkMs !== undefined ? { backend: executionMs, network: networkMs } : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.035]"
          >
            {/* Subtle glow in corner */}
            <div className={`pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full blur-2xl ${c.glow} opacity-60`} />

            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
                {c.label}
              </span>
              <Icon className={`h-3.5 w-3.5 ${c.color} opacity-70`} />
            </div>

            <div className={`relative z-10 mt-2 font-mono text-2xl font-semibold tabular-nums ${c.color}`}>
              {c.value}
              {c.suffix && <span className="ml-1 text-sm text-[#737373]">{c.suffix}</span>}
            </div>

            {"progress" in c && c.progress !== undefined && (
              <div className="relative z-10 mt-3 h-0.5 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.progress}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className={`h-full ${c.bar}`}
                />
              </div>
            )}

            {"breakdown" in c && c.breakdown && (
              <div className="relative z-10 mt-3 flex items-center justify-between text-[10px] text-[#737373] font-mono border-t border-white/[0.06] pt-2">
                {"files" in c.breakdown ? (
                  <>
                    <span className="text-[9px] uppercase tracking-wider text-[#9a9a9a]">Audited</span>
                    <span className="text-[#6366F1] font-semibold">{c.breakdown.files} files</span>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider block text-[#9a9a9a]">Backend</span>
                      <span className="text-[#bdbdbd] font-semibold">{(c.breakdown as { backend: number }).backend} ms</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider block text-[#9a9a9a]">Network</span>
                      <span className="text-[#bdbdbd] font-semibold">{(c.breakdown as { network: number }).network} ms</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
