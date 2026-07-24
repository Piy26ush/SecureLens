import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

const STAGES = [
  "Parsing Python Code",
  "Building Abstract Syntax Tree",
  "Detecting Security Vulnerabilities",
  "Retrieving OWASP & CWE Knowledge",
  "Generating AI Explanation",
  "Security Report Ready",
];

interface Props {
  running: boolean;
  /** External completion signal to jump to final stage */
  finished?: boolean;
}

export function PipelineLoader({ running, finished }: Props) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!running) {
      setStage(0);
      return;
    }
    setStage(0);
    const total = STAGES.length - 1;
    const interval = setInterval(() => {
      setStage((s) => (s < total - 1 ? s + 1 : s));
    }, 700);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (finished) setStage(STAGES.length - 1);
  }, [finished]);

  return (
    <div className="flex h-full flex-col items-center justify-center px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        {/* Spinning ring */}
        <div className="relative mx-auto mb-6 h-14 w-14">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6366F1]"
          />
          <div className="absolute inset-2 flex items-center justify-center rounded-full" style={{ backgroundColor: "rgba(99,102,241,0.08)" }}>
            <Loader2 className="h-5 w-5 animate-spin text-[#6366F1]" />
          </div>
        </div>

        <h3 className="text-base font-semibold" style={{ color: "#fdfdfd" }}>Running Security Audit</h3>
        <p className="mt-1 text-sm" style={{ color: "#737373" }}>
          SecureLens is analyzing your code through a deterministic pipeline.
        </p>
      </motion.div>

      <div className="w-full max-w-md space-y-2">
        {STAGES.map((label, i) => {
          const isDone = i < stage || (finished && i < STAGES.length - 1);
          const isActive = i === stage && !finished;
          const isFinal = i === STAGES.length - 1 && finished;
          const idle = i > stage && !finished;
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors ${
                isFinal
                  ? "border-emerald-500/25 bg-emerald-500/[0.05]"
                  : isActive
                  ? "border-[#6366F1]/40 bg-[#6366F1]/[0.05]"
                  : isDone
                  ? "border-white/[0.05] bg-white/[0.02]"
                  : "border-white/[0.04] bg-transparent"
              }`}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                <AnimatePresence mode="wait">
                  {isFinal ? (
                    <motion.div
                      key="final"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500"
                    >
                      <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                    </motion.div>
                  ) : isDone ? (
                    <motion.div
                      key="done"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/90"
                    >
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Loader2 className="h-4 w-4 animate-spin text-[#6366F1]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                    />
                  )}
                </AnimatePresence>
              </div>
              <span
                className={`text-sm ${
                  isFinal
                    ? "font-medium text-emerald-300"
                    : isActive
                    ? "font-medium"
                    : isDone
                    ? ""
                    : idle
                    ? ""
                    : ""
                }`}
                style={{
                  color: isFinal
                    ? undefined
                    : isActive
                    ? "#fdfdfd"
                    : isDone
                    ? "#bdbdbd"
                    : "#737373",
                }}
              >
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
