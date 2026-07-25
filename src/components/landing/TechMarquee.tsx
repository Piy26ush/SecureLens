import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Cpu, Database, Sparkles, Terminal, FileCode, CheckCircle2 } from "lucide-react";

const TECH_BADGES = [
  { label: "Deterministic AST Engine", icon: FileCode, color: "#8052ff" },
  { label: "OWASP Top 10 Standards", icon: ShieldCheck, color: "#ffb829" },
  { label: "CWE Vulnerability Index", icon: Database, color: "#06b6d4" },
  { label: "Gemini 2.5 AI Reasoning", icon: Sparkles, color: "#a855f7" },
  { label: "ChromaDB Vector RAG", icon: Cpu, color: "#38bdf8" },
  { label: "Python 3.12 Static Parser", icon: Terminal, color: "#22c55e" },
  { label: "Zero Code Execution Risk", icon: CheckCircle2, color: "#8052ff" },
];

export function TechMarquee() {
  // Duplicate array for seamless infinite marquee loop
  const marqueeItems = [...TECH_BADGES, ...TECH_BADGES, ...TECH_BADGES];

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        backgroundColor: "rgba(10, 10, 15, 0.9)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "16px 0",
        position: "relative",
        zIndex: 2,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Ambient gradient fade edges */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: "120px",
          background: "linear-gradient(to right, #000000 0%, transparent 100%)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: "120px",
          background: "linear-gradient(to left, #000000 0%, transparent 100%)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      <motion.div
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          whiteSpace: "nowrap",
          width: "fit-content",
        }}
      >
        {marqueeItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.label}-${idx}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "22.5px",
                padding: "8px 20px",
                fontSize: "13px",
                fontFamily: "'Inter', ui-sans-serif, sans-serif",
                fontWeight: 400,
                color: "#e0e0e0",
                letterSpacing: "0.02em",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.4)",
              }}
            >
              <Icon size={15} color={item.color} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
