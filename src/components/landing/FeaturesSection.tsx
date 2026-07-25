import { motion } from "motion/react";
import { type LucideIcon, TreeDeciduous, Database, Sparkles } from "lucide-react";
import { useState } from "react";

const EASING = [0.22, 1, 0.36, 1];

interface Feature {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  slideFrom: "left" | "right";
}

const FEATURES: Feature[] = [
  {
    icon: TreeDeciduous,
    title: "Deterministic AST Analysis",
    subtitle: "Static Code Parser",
    description:
      "Traverse source code syntax trees to isolate vulnerability signatures without executing untrusted code.",
    badge: "AST Engine",
    slideFrom: "left",
  },
  {
    icon: Database,
    title: "Security Context Retrieval",
    subtitle: "RAG Vector Store",
    description:
      "Retrieve relevant OWASP guidelines and CWE identifiers using semantic vector search embeddings.",
    badge: "ChromaDB RAG",
    slideFrom: "right",
  },
  {
    icon: Sparkles,
    title: "AI-Assisted Security Reports",
    subtitle: "Gemini Reasoning",
    description:
      "Generate grounded explanations, attack scenarios, and verified security recommendations using Gemini AI.",
    badge: "Gemini 2.5 AI",
    slideFrom: "left",
  },
];

export function FeaturesSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section
      id="features"
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
        {/* Section header — Re-triggers on scroll up & down (once: false) */}
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASING }}
          style={{ marginBottom: "72px" }}
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
            Core Architecture <span style={{ color: "#ffb829" }}>.</span>
          </p>
          <h2
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontWeight: 200,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Built on three security pillars <span style={{ color: "#ffb829" }}>.</span>
          </h2>
        </motion.div>

        {/* Feature cards grid — Re-triggers on scroll up & down (once: false) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px",
          }}
        >
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            const isLeft = feature.slideFrom === "left";
            const isHovered = hoveredIdx === i;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, ease: EASING, delay: i * 0.1 }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  backgroundColor: "rgba(10, 10, 15, 0.85)",
                  borderRadius: "20px",
                  padding: "40px 34px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "32px",
                  border: isHovered
                    ? "1px solid rgba(128, 82, 255, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(14px)",
                  position: "relative",
                  overflow: "hidden",
                  transform: isHovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
                  boxShadow: isHovered
                    ? "0 25px 50px -15px rgba(128, 82, 255, 0.25)"
                    : "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
                  transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* 3D Glass Corner Glow */}
                <div
                  style={{
                    position: "absolute",
                    top: -50,
                    right: -50,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    backgroundColor: isHovered ? "rgba(128, 82, 255, 0.25)" : "rgba(128, 82, 255, 0.05)",
                    filter: "blur(30px)",
                    transition: "all 0.3s ease",
                    pointerEvents: "none",
                  }}
                />

                {/* Top Badge & Floating Icon */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      backgroundColor: "rgba(128, 82, 255, 0.12)",
                      border: "1px solid rgba(128, 82, 255, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 15px rgba(128, 82, 255, 0.2)",
                      transform: isHovered ? "scale(1.08)" : "scale(1)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <Icon size={20} color="#8052ff" strokeWidth={1.5} />
                  </div>

                  <span
                    style={{
                      fontFamily: "'Inter', ui-sans-serif, sans-serif",
                      fontSize: "11px",
                      fontWeight: 400,
                      color: "#a0a0a0",
                      backgroundColor: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "22.5px",
                      padding: "4px 14px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {feature.badge}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontFamily: "'Fira Code', monospace",
                      color: "#ffb829",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: "8px",
                    }}
                  >
                    0{i + 1} — {feature.subtitle}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Inter', ui-sans-serif, sans-serif",
                      fontSize: "19px",
                      fontWeight: 400,
                      color: "#ffffff",
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                      marginBottom: "12px",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Inter', ui-sans-serif, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "#a0a0a0",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {feature.description}
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
