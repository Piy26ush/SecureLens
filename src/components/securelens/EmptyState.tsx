import { Shield, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col items-center justify-center px-8 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-2xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-[#21262d] bg-gradient-to-br from-slate-900 to-slate-950 shadow-inner">
          <Shield className="h-11 w-11 text-indigo-400" strokeWidth={1.75} />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-slate-100">No Security Scan Yet</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        Paste Python code or load a demo example and start your security audit.
      </p>
    </motion.div>
  );
}

export function SafeScanState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex h-full flex-col items-center justify-center px-8 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-emerald-500/15 blur-2xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-slate-950 shadow-inner">
          <ShieldCheck className="h-12 w-12 text-emerald-400" strokeWidth={1.75} />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-emerald-300">No vulnerabilities detected.</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        Your code passed the security audit.
      </p>
    </motion.div>
  );
}
