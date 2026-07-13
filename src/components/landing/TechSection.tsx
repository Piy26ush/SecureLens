import { motion } from "motion/react";

interface TechItem {
  name: string;
  category: string;
  svg: React.ReactNode;
}

const TECHS: TechItem[] = [
  {
    name: "Python",
    category: "Source & AST parsing",
    svg: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M14.25.18c.9 0 1.66.73 1.66 1.65v2.89h2.9c.92 0 1.65.73 1.65 1.65v3c0 .92-.73 1.65-1.65 1.65h-1v1c0 1.45-1.18 2.63-2.63 2.63H11.5v-1c0-.92-.73-1.65-1.65-1.65h-3c-.92 0-1.65-.73-1.65-1.65v-3c0-.92.73-1.65 1.65-1.65h1V3.46C6.88 2 8.06.82 9.5.82h4.75m-4.75 3.3a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z" />
        <path d="M9.75 23.82c-.9 0-1.66-.73-1.66-1.65v-2.89h-2.9c-.92 0-1.65-.73-1.65-1.65v-3c0-.92.73-1.65 1.65-1.65h1v-1c0-1.45 1.18-2.63 2.63-2.63H12.5v1c0 .92.73 1.65 1.65 1.65h3c.92 0 1.65.73 1.65 1.65v3c0 .92-.73 1.65-1.65 1.65h-1v2.89c0 1.46-1.18 2.63-2.63 2.63H9.75m4.75-3.3a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z" />
      </svg>
    ),
  },
  {
    name: "FastAPI",
    category: "REST API & AST Analysis",
    svg: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 0L1.47 6v12L12 24l10.53-6V6L12 0zm-1.5 17.5v-3.75l-4.5-2.25L15 6.5v3.75l4.5 2.25-9 5z" />
      </svg>
    ),
  },
  {
    name: "React & TS",
    category: "Front-end SPA Console",
    svg: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 6.857c-3.13 0-5.83.674-7.46 1.722C2.9 9.627 2 10.748 2 12c0 1.252.9 2.373 2.54 3.421 1.63 1.048 4.33 1.722 7.46 1.722s5.83-.674 7.46-1.722C21.1 14.373 22 13.252 22 12c0-1.252-.9-2.373-2.54-3.421-1.63-1.048-4.33-1.722-7.46-1.722zm0 12c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
      </svg>
    ),
  },
  {
    name: "Gemini AI",
    category: "Vulnerability Explanation Model",
    svg: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 0l3.09 9.09L24 12l-8.91 2.91L12 24l-3.09-9.09L0 12l8.91-2.91L12 0z" />
      </svg>
    ),
  },
  {
    name: "Vercel",
    category: "Serverless Deployment Hosting",
    svg: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 1L24 22H0L12 1z" />
      </svg>
    ),
  },
  {
    name: "Railway",
    category: "Backend Microservice Cloud",
    svg: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M22.8 11.25H1.2c-.66 0-1.2.54-1.2 1.2s.54 1.2 1.2 1.2h21.6c.66 0 1.2-.54 1.2-1.2s-.54-1.2-1.2-1.2zm-4.8-4.8H6c-.66 0-1.2.54-1.2 1.2s.54 1.2 1.2 1.2h12c.66 0 1.2-.54 1.2-1.2s-.54-1.2-1.2-1.2zm-4.8-4.8H10.8c-.66 0-1.2.54-1.2 1.2s.54 1.2 1.2 1.2H13.2c.66 0 1.2-.54 1.2-1.2s-.54-1.2-1.2-1.2z" />
      </svg>
    ),
  },
];

export function TechSection() {
  return (
    <section
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
            Technology Stack
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
            Engineering Foundation
          </h2>
        </motion.div>

        {/* Tech list grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            show: { transition: { staggerChildren: 0.08 } },
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "40px",
          }}
        >
          {TECHS.map((tech) => (
            <motion.div
              key={tech.name}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              {/* Grayscale Icon */}
              <div
                style={{
                  color: "var(--landing-stone)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {tech.svg}
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: "'Inter', ui-sans-serif, sans-serif",
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "var(--landing-paper)",
                    margin: "0 0 4px",
                  }}
                >
                  {tech.name}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', ui-sans-serif, sans-serif",
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "var(--landing-stone)",
                    lineHeight: 1.4,
                    margin: 0,
                  }}
                >
                  {tech.category}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
