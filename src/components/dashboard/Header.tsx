import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export function Header() {
  const [pingOk, setPingOk] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(
      (import.meta.env.VITE_API_URL || "https://securelens-backend.onrender.com") + "/api/health",
      { signal: AbortSignal.timeout(5000) }
    )
      .then((r) => setPingOk(r.ok))
      .catch(() => setPingOk(false));
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-4 pb-2"
    >
      {/* Back to landing */}
      <Link
        to="/"
        className="flex items-center gap-1.5 text-[11px] font-medium text-[#9a9a9a] transition-colors hover:text-[#fdfdfd] group"
      >
        <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
        Home
      </Link>

      <div className="h-4 w-px bg-white/[0.08]" />

      {/* Logo + name */}
      <div className="flex items-center gap-2.5">
        <img
          src="/logo.png"
          alt="SecureLens"
          className="h-7 w-7 rounded-lg object-cover"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[14px] font-semibold tracking-tight text-[#fdfdfd]">SecureLens</h1>
            <span className="rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-2 py-0.5 text-[10px] font-medium tracking-wider text-[#6366F1]">
              v1.0
            </span>
          </div>
          <p className="text-[10px] text-[#737373]">AI-Assisted Secure Code Auditor</p>
        </div>
      </div>

      {/* Engine status */}
      <div className="ml-auto flex items-center gap-1.5 text-[11px] text-[#737373]">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            pingOk === null
              ? "bg-[#737373] animate-pulse"
              : pingOk
              ? "bg-emerald-500"
              : "bg-red-400"
          }`}
        />
        {pingOk === null ? "Connecting…" : pingOk ? "Engine online" : "Engine offline"}
      </div>
    </motion.header>
  );
}
