import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check } from "lucide-react";

interface Props {
  vulnerable?: string | null;
  secure?: string | null;
}

function CodeBlock({ code, tone }: { code: string; tone: "danger" | "safe" }) {
  const bg = tone === "danger" ? "bg-red-950/30 border-red-900/40" : "bg-emerald-950/25 border-emerald-900/40";
  return (
    <pre
      className={`overflow-x-auto rounded-lg border ${bg} p-3 font-mono text-[12px] leading-relaxed text-slate-200`}
      style={{ fontFamily: "'Fira Code', ui-monospace, monospace" }}
    >
      <code>{code}</code>
    </pre>
  );
}

export function CodeComparison({ vulnerable, secure }: Props) {
  const [copied, setCopied] = useState(false);
  if (!vulnerable && !secure) return null;

  const copy = async () => {
    if (!secure) return;
    try {
      await navigator.clipboard.writeText(secure);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {vulnerable && (
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-red-400">
            <span>✕</span> Vulnerable Code
          </div>
          <CodeBlock code={vulnerable} tone="danger" />
        </div>
      )}
      {secure && (
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-emerald-400">
              <span>✓</span> Secure Fix
            </div>
            <button
              onClick={copy}
              className="flex items-center gap-1 rounded-md border border-[#21262d] bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="copied"
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 3 }}
                    className="flex items-center gap-1 text-emerald-400"
                  >
                    <Check className="h-3 w-3" strokeWidth={3} /> Copied
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" /> Copy Fix
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
          <CodeBlock code={secure} tone="safe" />
        </div>
      )}
    </div>
  );
}
