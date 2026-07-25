import { motion } from "motion/react";
import { FileCode2, Search, Brain, ShieldCheck, Code2 } from "lucide-react";

const EASING = [0.22, 1, 0.36, 1];

const STAGES = [
  {
    icon: Code2,
    label: "Python Source Submission",
    description: "Developer submits raw Python code or loads multi-file repository scopes.",
    slideFrom: "left" as const,
  },
  {
    icon: FileCode2,
    label: "AST Static Syntax Analysis",
    description: "Deterministic AST traversal flags vulnerable code patterns without executing code.",
    slideFrom: "right" as const,
  },
  {
    icon: Search,
    label: "Semantic Security Knowledge RAG",
    description: "Retrieves OWASP guidelines and CWE IDs using vector similarity search.",
    slideFrom: "left" as const,
  },
  {
    icon: Brain,
    label: "Gemini AI Security Reasoning",
    description: "Synthesizes AST findings and RAG context into grounded threat explanations.",
    slideFrom: "right" as const,
  },
  {
    icon: ShieldCheck,
    label: "Auditor Security Report",
    description: "Outputs structured risk metrics, attack scenarios, and verified code fixes.",
    slideFrom: "left" as const,
    accent: true,
  },
];

export function ArchitectureSection() {
  return (
    <section
      id="architecture"
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
        {/* Header — Re-triggers on scroll up & down (once: false) */}
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASING }}
          style={{ marginBottom: "80px" }}
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
            Pipeline Flow <span style={{ color: "#ffb829" }}>.</span>
          </p>
          <h2
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontWeight: 200,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 16px",
            }}
          >
            From code to security report <span style={{ color: "#ffb829" }}>.</span>
          </h2>
          <p
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "17px",
              fontWeight: 400,
              color: "#a0a0a0",
              lineHeight: 1.5,
              maxWidth: "540px",
            }}
          >
            A multi-stage pipeline that combines deterministic AST scanning with AI reasoning.
          </p>
        </motion.div>

        {/* Pipeline Stages — Re-triggers on scroll up & down (once: false) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "840px" }}>
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isLeft = stage.slideFrom === "left";

            return (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, ease: EASING, delay: idx * 0.08 }}
                whileHover={{
                  x: isLeft ? 6 : -6,
                  borderColor: "rgba(128, 82, 255, 0.4)",
                  boxShadow: "0 15px 35px -10px rgba(128, 82, 255, 0.2)",
                }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "24px",
                  backgroundColor: "rgba(10, 10, 15, 0.85)",
                  border: stage.accent
                    ? "1px solid rgba(128, 82, 255, 0.4)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "18px",
                  padding: "28px 30px",
                  backdropFilter: "blur(12px)",
                  boxShadow: stage.accent
                    ? "0 0 30px rgba(128, 82, 255, 0.15)"
                    : "none",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Stage Icon */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: stage.accent ? "#8052ff" : "rgba(128, 82, 255, 0.1)",
                    border: stage.accent ? "none" : "1px solid rgba(128, 82, 255, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={19} color={stage.accent ? "#ffffff" : "#8052ff"} strokeWidth={1.5} />
                </div>

                {/* Stage Text */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justify: "space-between", marginBottom: "6px" }}>
                    <h3
                      style={{
                        fontFamily: "'Inter', ui-sans-serif, sans-serif",
                        fontSize: "17px",
                        fontWeight: 400,
                        color: stage.accent ? "#8052ff" : "#ffffff",
                        lineHeight: 1.3,
                        margin: 0,
                      }}
                    >
                      {stage.label}
                    </h3>
                    <span style={{ fontFamily: "'Fira Code', monospace", fontSize: "11px", color: "#ffb829" }}>
                      0{idx + 1}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Inter', ui-sans-serif, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#a0a0a0",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {stage.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
