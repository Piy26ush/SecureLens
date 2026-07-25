import React, { useState } from "react";
import { motion } from "motion/react";
import { Terminal, Play, CheckCircle2, ShieldAlert, Copy, Check } from "lucide-react";

const EASING = [0.22, 1, 0.36, 1];

const COMMAND_PRESETS = [
  { cmd: "npx securelens-ai scan ./ --ast-only", label: "AST Scan Only" },
  { cmd: "npx securelens-ai audit ./ --rag", label: "Full RAG + AI Audit" },
  { cmd: "npx securelens-ai export ./ --pdf", label: "Export PDF Deliverable" },
];

export function CliTerminal() {
  const [activeCmdIdx, setActiveCmdIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const activePreset = COMMAND_PRESETS[activeCmdIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(activePreset.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      style={{
        backgroundColor: "#000000",
        padding: "clamp(80px, 12vh, 160px) clamp(16px, 5vw, 40px)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* Header — Re-triggers on scroll up & down */}
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASING }}
          style={{ marginBottom: "48px", textAlign: "center" }}
        >
          <p
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "12px",
              fontWeight: 400,
              color: "#8052ff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Developer CLI Integration <span style={{ color: "#ffb829" }}>.</span>
          </p>
          <h2
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "clamp(30px, 4vw, 48px)",
              fontWeight: 200,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 16px",
            }}
          >
            Run SecureLens directly in CLI & CI/CD <span style={{ color: "#ffb829" }}>.</span>
          </h2>
          <p
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "16px",
              fontWeight: 400,
              color: "#a0a0a0",
              lineHeight: 1.5,
              maxWidth: "540px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Automate Python security audits in terminal scripts, pre-commit hooks, or GitHub Actions pipelines.
          </p>
        </motion.div>

        {/* Command Preset Selector Pills */}
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
          {COMMAND_PRESETS.map((preset, idx) => {
            const isSelected = activeCmdIdx === idx;
            return (
              <button
                key={preset.label}
                onClick={() => setActiveCmdIdx(idx)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: isSelected ? "rgba(128, 82, 255, 0.2)" : "rgba(255, 255, 255, 0.03)",
                  border: isSelected ? "1px solid rgba(128, 82, 255, 0.5)" : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "22.5px",
                  padding: "7px 18px",
                  fontSize: "12px",
                  fontFamily: "'Inter', ui-sans-serif, sans-serif",
                  color: isSelected ? "#ffffff" : "#a0a0a0",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <Terminal size={13} color={isSelected ? "#8052ff" : "#a0a0a0"} />
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* macOS Terminal Window Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASING }}
          style={{
            backgroundColor: "#050508",
            borderRadius: "18px",
            border: "1px solid rgba(128, 82, 255, 0.3)",
            overflow: "hidden",
            boxShadow: "0 30px 80px -15px rgba(0, 0, 0, 0.95), 0 0 40px rgba(128, 82, 255, 0.15)",
          }}
        >
          {/* Terminal Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              backgroundColor: "rgba(15, 15, 22, 0.9)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff5f56", display: "inline-block" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ffbd2e", display: "inline-block" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#27c93f", display: "inline-block" }} />
            </div>

            <span style={{ fontFamily: "'Fira Code', monospace", fontSize: "11px", color: "#a0a0a0" }}>
              zsh — securelens-cli v1.0
            </span>

            <button
              onClick={handleCopy}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "6px",
                padding: "4px 10px",
                fontSize: "11px",
                fontFamily: "'Fira Code', monospace",
                color: "#a0a0a0",
                cursor: "pointer",
              }}
            >
              {copied ? <Check size={12} color="#22c55e" /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {/* Terminal Body */}
          <div style={{ padding: "24px", fontFamily: "'Fira Code', ui-monospace, monospace", fontSize: "13px", lineHeight: 1.7, color: "#e0e0e0" }}>
            <div style={{ color: "#8052ff", marginBottom: "12px" }}>
              $ <span style={{ color: "#ffffff" }}>{activePreset.cmd}</span>
            </div>

            <div style={{ color: "#a0a0a0" }}>
              [1/4] Loading Python AST module parser... <span style={{ color: "#22c55e" }}>[DONE 42ms]</span>
            </div>
            <div style={{ color: "#a0a0a0" }}>
              [2/4] Traversing Abstract Syntax Tree nodes... <span style={{ color: "#22c55e" }}>[DONE 88ms]</span>
            </div>
            <div style={{ color: "#a0a0a0" }}>
              [3/4] Querying ChromaDB Vector RAG for CWE-89 / OWASP A03... <span style={{ color: "#22c55e" }}>[DONE 140ms]</span>
            </div>
            <div style={{ color: "#a0a0a0", marginBottom: "12px" }}>
              [4/4] Gemini 2.5 AI generating grounded fix recommendations... <span style={{ color: "#22c55e" }}>[DONE 310ms]</span>
            </div>

            <div style={{ backgroundColor: "rgba(128, 82, 255, 0.1)", borderLeft: "3px solid #8052ff", padding: "10px 14px", marginTop: "12px", borderRadius: "4px" }}>
              <span style={{ color: "#ffb829", fontWeight: 600 }}>✔ AUDIT COMPLETE:</span> 1 Vulnerability Detected (SQL Injection CWE-89) • Risk Score: 75/100
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
