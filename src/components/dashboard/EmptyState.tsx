import { Shield, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full flex-col items-center justify-center px-8 text-center py-16"
    >
      {/* Animated glow ring */}
      <div className="relative mb-8">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-[#6366F1]/20 blur-2xl"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-3 rounded-full border border-[#6366F1]/10"
          style={{
            borderStyle: "dashed",
          }}
        />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <Shield className="h-9 w-9 text-[#6366F1]" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-base font-semibold text-[#fdfdfd]">No Security Scan Yet</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#737373]">
        Paste Python code or load a demo example to start your security audit.
      </p>

      {/* Feature pills */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {["AST Analysis", "OWASP", "CWE", "AI Reasoning"].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[#9a9a9a]"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function SafeScanState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full flex-col items-center justify-center px-8 text-center py-16"
    >
      <div className="relative mb-8">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl"
        />
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "backOut" }}
          className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06]"
        >
          <ShieldCheck className="h-9 w-9 text-emerald-400" strokeWidth={1.5} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="text-base font-semibold text-emerald-300">No vulnerabilities detected.</h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#737373]">
          Your code passed the security audit cleanly.
        </p>
      </motion.div>
    </motion.div>
  );
}
