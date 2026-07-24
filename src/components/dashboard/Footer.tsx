import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-[#21262d] px-6 py-3 text-[11px] text-slate-500">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span>SecureLens Engine online</span>
      </div>
      <div className="flex items-center gap-3">
        <span>AST · OWASP · CWE · AI</span>
        <Github className="h-3.5 w-3.5" />
      </div>
    </footer>
  );
}
