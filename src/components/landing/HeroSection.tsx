import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Github } from "lucide-react";

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function HeroSection() {
  return (
    <section
      style={{
        minHeight: "100svh",
        backgroundColor: "var(--landing-canvas)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 40px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid pattern — very low opacity, not a gradient */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        style={{
          maxWidth: "var(--landing-max-width)",
          width: "100%",
          zIndex: 1,
        }}
      >
        {/* Category label */}
        <motion.div variants={FADE_UP} transition={{ duration: 0.5 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "#6366F1",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "32px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#6366F1",
              }}
            />
            v1.0 — Now Available
          </span>
        </motion.div>

        {/* Display headline */}
        <motion.h1
          variants={FADE_UP}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "'Inter', ui-sans-serif, sans-serif",
            fontSize: "clamp(48px, 7vw, 80px)",
            fontWeight: 500,
            color: "var(--landing-paper)",
            lineHeight: 0.96,
            letterSpacing: "-0.04em",
            margin: "0 0 32px",
            maxWidth: "900px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          AI-Assisted Secure Code Review Platform
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={FADE_UP}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "'Inter', ui-sans-serif, sans-serif",
            fontSize: "clamp(16px, 2vw, 20px)",
            fontWeight: 400,
            color: "var(--landing-pearl)",
            lineHeight: 1.5,
            letterSpacing: "-0.01em",
            maxWidth: "640px",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "48px",
          }}
        >
          SecureLens combines deterministic AST analysis, semantic retrieval, and
          AI reasoning to detect vulnerabilities and generate grounded security
          reports before deployment.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={FADE_UP}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "80px",
          }}
        >
          {/* Primary */}
          <Link to="/">
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
                letterSpacing: "-0.01em",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#4f46e5")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#6366F1")
              }
            >
              Launch SecureLens
              <ArrowRight size={15} />
            </motion.button>
          </Link>

          {/* Ghost */}
          <motion.a
            href="https://github.com/Piy26ush/SecureLens"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              color: "var(--landing-paper)",
              backgroundColor: "transparent",
              border: "1px solid rgba(253,253,253,0.2)",
              borderRadius: "9999px",
              padding: "12px 28px",
              cursor: "pointer",
              letterSpacing: "-0.01em",
              textDecoration: "none",
              transition: "border-color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(253,253,253,0.5)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(253,253,253,0.2)")
            }
          >
            <Github size={15} />
            View GitHub
          </motion.a>
        </motion.div>

        {/* Dashboard browser mockup */}
        <motion.div
          variants={FADE_UP}
          transition={{ duration: 0.7 }}
          style={{
            width: "100%",
            maxWidth: "1000px",
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "var(--landing-charcoal)",
            borderRadius: "14px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Browser chrome bar */}
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
                letterSpacing: "0.01em",
                textAlign: "center",
                maxWidth: "300px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              securelens.vercel.app
            </div>
          </div>

          {/* Dashboard screenshot */}
          <img
            src="/dashboard-preview.png"
            alt="SecureLens dashboard — AI-powered security code review interface"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
            }}
            loading="eager"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
