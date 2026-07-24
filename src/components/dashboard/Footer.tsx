import { Github } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.05] px-6 py-3.5 text-[11px] text-[#737373]">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>SecureLens Engine online</span>
        </div>
        <span className="hidden sm:inline text-[#9a9a9a] tracking-wider uppercase text-[10px] font-medium">AST · OWASP · CWE · AI</span>
      </div>
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-[11px] text-[#737373] transition-colors hover:text-[#fdfdfd]"
        >
          Landing
        </Link>
        <a
          href="https://github.com/Piy26ush/SecureLens"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[#737373] transition-colors hover:text-[#fdfdfd]"
        >
          <Github className="h-3.5 w-3.5" />
          GitHub
        </a>
      </div>
    </footer>
  );
}
