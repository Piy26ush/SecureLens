import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function ShowcaseSection() {
  return (
    <section
      style={{
        backgroundColor: "var(--landing-canvas)",
        padding: "120px 40px",
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
          style={{ marginBottom: "64px", textAlign: "center" }}
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
            Product Showcase
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
            A security dashboard designed for speed
          </h2>
          <p
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "18px",
              fontWeight: 400,
              color: "var(--landing-ash)",
              lineHeight: 1.5,
              maxWidth: "540px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Review risk distributions, scan times, network latency, and OWASP details in one unified console.
          </p>
        </motion.div>

        {/* Large Browser mockup showcasing the interface */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          style={{
            width: "100%",
            backgroundColor: "var(--landing-charcoal)",
            borderRadius: "14px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.06)",
            marginBottom: "48px",
          }}
        >
          {/* Mockup Topbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              backgroundColor: "var(--landing-graphite)",
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#3f3f3f", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#3f3f3f", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#3f3f3f", display: "inline-block" }} />
            <div
              style={{
                marginLeft: "12px",
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.04)",
                borderRadius: "9999px",
                padding: "4px 14px",
                fontFamily: "'Inter', ui-sans-serif, sans-serif",
                fontSize: "12px",
                color: "var(--landing-stone)",
                textAlign: "center",
                maxWidth: "320px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              securelens.vercel.app/dashboard
            </div>
          </div>

          <img
            src="/dashboard-preview.png"
            alt="SecureLens Dashboard UI Showcase"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
            loading="lazy"
          />
        </motion.div>

        {/* CTA to launch */}
        <div style={{ textAlign: "center" }}>
          <Link to="/app">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'Inter', ui-sans-serif, sans-serif",
                fontSize: "15px",
                fontWeight: 500,
                color: "#fdfdfd",
                backgroundColor: "#6366F1",
                border: "none",
                borderRadius: "9999px",
                padding: "12px 28px",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#4f46e5")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#6366F1")
              }
            >
              Try Deployed App
              <ArrowRight size={15} />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
