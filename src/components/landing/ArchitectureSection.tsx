import { motion } from "motion/react";
import { FileCode2, Search, Brain, ShieldCheck, Code2 } from "lucide-react";

const STAGES = [
  {
    icon: Code2,
    label: "Python Code",
    description: "Developer submits raw Python source code for analysis.",
    accent: false,
  },
  {
    icon: FileCode2,
    label: "AST Static Analysis",
    description:
      "Deterministic traversal of the Abstract Syntax Tree detects dangerous patterns without executing code.",
    accent: false,
  },
  {
    icon: Search,
    label: "Security Knowledge Retrieval",
    description:
      "Relevant OWASP Top 10 and CWE guidelines are retrieved using semantic TF-IDF search.",
    accent: false,
  },
  {
    icon: Brain,
    label: "AI Reasoning",
    description:
      "Gemini AI synthesizes AST findings and retrieved context into grounded, human-readable explanations.",
    accent: false,
  },
  {
    icon: ShieldCheck,
    label: "Security Report",
    description:
      "A structured report is returned with severity ratings, attack scenarios, OWASP/CWE references, and secure code fixes.",
    accent: true,
  },
];

export function ArchitectureSection() {
  return (
    <section
      id="architecture"
      style={{
        backgroundColor: "var(--landing-canvas)",
        padding: "clamp(64px, 8vh, 120px) clamp(16px, 5vw, 40px)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--landing-max-width)",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "80px" }}
        >
          <p
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "#6366F1",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            How it works
          </p>
          <h2
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 500,
              color: "var(--landing-paper)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 16px",
            }}
          >
            From code to security report
          </h2>
          <p
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "18px",
              fontWeight: 400,
              color: "var(--landing-ash)",
              lineHeight: 1.5,
              maxWidth: "520px",
            }}
          >
            A multi-stage pipeline that combines deterministic analysis with
            AI-generated context.
          </p>
        </motion.div>

        {/* Pipeline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            maxWidth: "640px",
          }}
        >
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isLast = idx === STAGES.length - 1;

            return (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                style={{ display: "flex", gap: "24px", width: "100%" }}
              >
                {/* Left column: icon + line */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  {/* Icon circle */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: stage.accent
                        ? "#6366F1"
                        : "var(--landing-charcoal)",
                      border: stage.accent
                        ? "none"
                        : "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      size={17}
                      color={stage.accent ? "#fff" : "var(--landing-ash)"}
                      strokeWidth={1.75}
                    />
                  </div>

                  {/* Connector line */}
                  {!isLast && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.4, delay: idx * 0.08 + 0.2 }}
                      style={{
                        width: "1px",
                        flex: 1,
                        minHeight: "40px",
                        backgroundColor: "rgba(255,255,255,0.08)",
                        transformOrigin: "top",
                        margin: "4px 0",
                      }}
                    />
                  )}
                </div>

                {/* Right column: text */}
                <div style={{ paddingBottom: isLast ? 0 : "40px" }}>
                  <p
                    style={{
                      fontFamily: "'Inter', ui-sans-serif, sans-serif",
                      fontSize: "16px",
                      fontWeight: 500,
                      color: stage.accent ? "#6366F1" : "var(--landing-paper)",
                      lineHeight: 1.25,
                      marginBottom: "8px",
                      marginTop: "8px",
                    }}
                  >
                    {stage.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', ui-sans-serif, sans-serif",
                      fontSize: "15px",
                      fontWeight: 400,
                      color: "var(--landing-stone)",
                      lineHeight: 1.5,
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
