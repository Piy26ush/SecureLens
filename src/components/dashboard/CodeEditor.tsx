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

  useEffect(() => {
    // Detect mobile UA or narrow width to disable Monaco
    const checkMobile = () => {
      const mobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(window.innerWidth < 768 || mobileUA);
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
    <div className="relative flex-1 overflow-hidden rounded-xl border border-[#21262d] bg-[#0b1020]">
      <div className="flex items-center justify-between border-b border-[#21262d] bg-slate-950/60 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
          audit.py — python
        </span>
        <span className="text-[10px] text-slate-500">{value.split("\n").length} lines</span>
      </div>

      {ready && !isMobile ? (
        <Editor
          height="calc(100% - 33px)"
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
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          spellCheck={false}
          placeholder="Paste Python code here for security auditing..."
          className="h-[calc(100%-33px)] w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed text-slate-200 outline-none placeholder:text-slate-600"
          style={{ fontFamily: "'Fira Code', ui-monospace, monospace" }}
        />
      )}
    </div>
  );
}
