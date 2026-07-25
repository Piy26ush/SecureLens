import Editor, { loader } from "@monaco-editor/react";
import { useEffect, useState } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function CodeEditor({ value, onChange, disabled }: Props) {
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Detect mobile UA or narrow width to disable Monaco
    const checkMobile = () => {
      const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(window.innerWidth < 1024 || mobileUA);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    loader
      .init()
      .then(() => setReady(true))
      .catch(() => setReady(false));

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative flex-1 flex flex-col overflow-hidden rounded-xl border border-white/[0.07]" style={{ backgroundColor: "#0a0a0f" }}>
      <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2 flex-shrink-0" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500/60" />
          <span className="h-2 w-2 rounded-full bg-amber-500/60" />
          <span className="h-2 w-2 rounded-full bg-emerald-500/60" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "#737373" }}>
          audit.py — python
        </span>
        <span className="text-[10px]" style={{ color: "#737373" }}>{value.split("\n").length} lines</span>
      </div>

      {!mounted ? (
        /* SSR & Hydration Phase: render stable standard textarea with explicit height */
        <textarea
          readOnly
          value={value}
          placeholder="Loading auditor editor..."
          className="w-full flex-1 resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed outline-none"
          style={{ fontFamily: "'Fira Code', ui-monospace, monospace", color: "#d4d4d4" }}
        />
      ) : ready && !isMobile ? (
        <div className="w-full flex-1 min-h-0">
          <Editor
            height="100%"
            defaultLanguage="python"
            language="python"
            theme="vs-dark"
            value={value}
            onChange={(v) => onChange(v ?? "")}
            options={{
              readOnly: disabled,
              fontFamily: "'Fira Code', ui-monospace, SFMono-Regular, monospace",
              fontLigatures: true,
              fontSize: 13,
              lineNumbers: "on",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              renderLineHighlight: "gutter",
              padding: { top: 12, bottom: 12 },
              smoothScrolling: true,
              cursorBlinking: "smooth",
              tabSize: 4,
            }}
          />
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          spellCheck={false}
          placeholder="Paste Python code here for security auditing..."
          className="w-full flex-1 resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed outline-none"
          style={{ fontFamily: "'Fira Code', ui-monospace, monospace", color: "#d4d4d4" }}
        />
      )}
    </div>
  );
}
