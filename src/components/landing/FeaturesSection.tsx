import { motion } from "motion/react";
import { type LucideIcon, TreeDeciduous, Database, Sparkles } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: TreeDeciduous,
    title: "Deterministic AST Analysis",
    description:
      "Static code analysis that detects vulnerabilities using AST traversal — no code execution required.",
  },
  {
    icon: Database,
    title: "Security Knowledge Retrieval",
    description:
      "Retrieve relevant OWASP and CWE guidance using semantic search over a curated security knowledge base.",
  },
  {
    icon: Sparkles,
    title: "AI-Assisted Reports",
    description:
      "Generate grounded explanations, concrete attack scenarios, and secure code recommendations powered by Gemini AI.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
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
          style={{ marginBottom: "64px" }}
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
            Core capabilities
          </p>
          <h2
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 500,
              color: "var(--landing-paper)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Built on three pillars
          </h2>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            show: { transition: { staggerChildren: 0.1 } },
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1px",
            backgroundColor: "rgba(255,255,255,0.06)",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                style={{
                  backgroundColor: "var(--landing-charcoal)",
                  padding: "40px 32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: "rgba(99,102,241,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color="#6366F1" strokeWidth={1.75} />
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: "'Inter', ui-sans-serif, sans-serif",
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "var(--landing-paper)",
                      lineHeight: 1.25,
                      letterSpacing: "-0.01em",
                      marginBottom: "10px",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Inter', ui-sans-serif, sans-serif",
                      fontSize: "15px",
                      fontWeight: 400,
                      color: "var(--landing-stone)",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
