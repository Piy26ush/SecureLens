import React from "react";
import { motion } from "motion/react";
import { Download, FileText, ShieldCheck, AlertTriangle, CheckCircle2, Award } from "lucide-react";
import { toast } from "sonner";

const EASING = [0.22, 1, 0.36, 1];

export function PdfReportShowcase() {
  const handleDownloadSample = () => {
    toast.success("Security PDF Report Downloaded", {
      description: "Sample enterprise audit report generated for review.",
    });
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
          maxWidth: "1140px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* Text Left — Slides in from Left */}
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: EASING }}
          >
            <p
              style={{
                fontFamily: "'Inter', ui-sans-serif, sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                color: "#8052ff",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              Exportable Deliverables <span style={{ color: "#ffb829" }}>.</span>
            </p>
            <h2
              style={{
                fontFamily: "'Inter', ui-sans-serif, sans-serif",
                fontSize: "clamp(32px, 4.5vw, 52px)",
                fontWeight: 200,
                color: "#ffffff",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                margin: "0 0 20px",
              }}
            >
              Executive Security PDF Audit Reports <span style={{ color: "#ffb829" }}>.</span>
            </h2>
            <p
              style={{
                fontFamily: "'Inter', ui-sans-serif, sans-serif",
                fontSize: "16px",
                fontWeight: 400,
                color: "#a0a0a0",
                lineHeight: 1.6,
                margin: "0 0 32px",
              }}
            >
              Generate structured, CISO-ready PDF security reports complete with risk metrics, OWASP/CWE vulnerability breakdowns, attack scenarios, and verified AST code recommendations.
            </p>

            <motion.button
              onClick={handleDownloadSample}
              whileHover={{ scale: 1.03, backgroundColor: "#6b3df5" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#8052ff",
                color: "#ffffff",
                border: "none",
                borderRadius: "22.5px",
                padding: "13px 28px",
                fontSize: "14px",
                fontFamily: "'Inter', ui-sans-serif, sans-serif",
                fontWeight: 500,
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(128, 82, 255, 0.3)",
              }}
            >
              <Download size={15} />
              Download Sample Security PDF
            </motion.button>
          </motion.div>

          {/* Visual Right — Glassmorphic PDF Card Mockup — Slides in from Right */}
          <motion.div
            initial={{ opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: EASING }}
            style={{
              backgroundColor: "rgba(10, 10, 15, 0.9)",
              borderRadius: "20px",
              border: "1px solid rgba(128, 82, 255, 0.3)",
              padding: "32px",
              backdropFilter: "blur(16px)",
              boxShadow: "0 30px 80px -15px rgba(0, 0, 0, 0.9), 0 0 30px rgba(128, 82, 255, 0.15)",
            }}
          >
            {/* Report Header Mockup */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FileText size={20} color="#8052ff" />
                <div>
                  <span style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif", fontSize: "15px", fontWeight: 500, color: "#ffffff", display: "block" }}>
                    SecureLens Executive Report
                  </span>
                  <span style={{ fontFamily: "'Fira Code', monospace", fontSize: "11px", color: "#a0a0a0" }}>
                    Scope: /backend/scanner/pipeline.py
                  </span>
                </div>
              </div>
              <Award size={20} color="#ffb829" />
            </div>

            {/* Risk Gauge & Metrics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              <div style={{ backgroundColor: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.25)", borderRadius: "12px", padding: "16px" }}>
                <span style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif", fontSize: "11px", color: "#f87171", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "4px" }}>
                  Risk Score
                </span>
                <span style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif", fontSize: "28px", fontWeight: 200, color: "#f87171" }}>
                  75<span style={{ fontSize: "14px", color: "#a0a0a0" }}>/100</span>
                </span>
              </div>

              <div style={{ backgroundColor: "rgba(128, 82, 255, 0.08)", border: "1px solid rgba(128, 82, 255, 0.25)", borderRadius: "12px", padding: "16px" }}>
                <span style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif", fontSize: "11px", color: "#8052ff", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "4px" }}>
                  OWASP Findings
                </span>
                <span style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif", fontSize: "28px", fontWeight: 200, color: "#ffffff" }}>
                  2 <span style={{ fontSize: "12px", color: "#ffb829" }}>Critical</span>
                </span>
              </div>
            </div>

            {/* Sample Finding Row */}
            <div style={{ backgroundColor: "#050508", borderRadius: "10px", padding: "14px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", color: "#ffffff", fontWeight: 500, marginBottom: "4px" }}>
                <span>SQL Injection (CWE-89)</span>
                <span style={{ color: "#ef4444", fontSize: "10px", fontFamily: "'Fira Code', monospace" }}>CRITICAL</span>
              </div>
              <p style={{ margin: 0, fontFamily: "'Inter', ui-sans-serif, sans-serif", fontSize: "12px", color: "#a0a0a0" }}>
                AST Traversal isolated unparameterized query execution at line 8.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
