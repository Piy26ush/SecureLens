import { motion } from "motion/react";

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-3"
    >
      <img
        src="/favicon.png"
        alt="SecureLens Logo"
        className="h-11 w-11 rounded-xl object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-slate-50">SecureLens</h1>
          <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-indigo-300">
            v1.0
          </span>
        </div>
        <p className="text-xs text-slate-400">AI-Assisted Secure Code Auditor</p>
      </div>
    </motion.header>
  );
}
