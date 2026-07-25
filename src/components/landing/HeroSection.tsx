import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Github, ShieldCheck } from "lucide-react";
import { ThreeDHeroCanvas } from "./ThreeDHeroCanvas";
import { useState } from "react";

const EASING = [0.22, 1, 0.36, 1];

const FADE_LEFT = {
  hidden: { opacity: 0, x: -70 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASING } },
};

const FADE_RIGHT = {
  hidden: { opacity: 0, x: 70 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASING } },
};

const FADE_UP = {
  hidden: { opacity: 0, y: 35 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASING } },
};

export function HeroSection() {
  // 3D Card mouse parallax tilt state
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, spotX: 50, spotY: 50 });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: y * -14, // rotateX
      ry: x * 14,  // rotateY
      spotX: ((e.clientX - rect.left) / rect.width) * 100,
      spotY: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleCardMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, spotX: 50, spotY: 50 });
  };

  return (
    <div style={{ position: "relative", backgroundColor: "#000000", overflow: "hidden" }}>
      {/* 3D Canvas Stage */}
      <ThreeDHeroCanvas />

      {/* HERO SECTION STAGE */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(120px, 16vh, 160px) clamp(16px, 5vw, 40px) 60px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            width: "100%",
            position: "relative",
          }}
        >
          {/* Badge — Re-triggers on scroll up/down (once: false) */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
            variants={FADE_LEFT}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'Inter', ui-sans-serif, sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                color: "#e0e0e0",
                backgroundColor: "rgba(128, 82, 255, 0.08)",
                border: "1px solid rgba(128, 82, 255, 0.25)",
                borderRadius: "22.5px",
                padding: "6px 18px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "32px",
                backdropFilter: "blur(12px)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#ffb829",
                  display: "inline-block",
                  boxShadow: "0 0 10px #ffb829",
                }}
              />
              Enterprise Code Security Auditor <span style={{ color: "#ffb829" }}>.</span>
            </span>
          </motion.div>

          {/* Display Headline — Re-triggers on scroll up/down (once: false) */}
          <motion.h1
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
            variants={FADE_LEFT}
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "clamp(48px, 7.5vw, 86px)",
              fontWeight: 200,
              color: "#ffffff",
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
              margin: "0 0 28px",
              maxWidth: "960px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            AI-Assisted Secure Code Review Platform <span style={{ color: "#8052ff" }}>.</span>
          </motion.h1>

          {/* Subheading — Re-triggers on scroll up/down (once: false) */}
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
            variants={FADE_RIGHT}
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "clamp(16px, 2vw, 20px)",
              fontWeight: 400,
              color: "#a0a0a0",
              lineHeight: 1.6,
              letterSpacing: "-0.01em",
              maxWidth: "680px",
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: "48px",
            }}
          >
            SecureLens combines deterministic AST analysis, semantic security retrieval, and
            Gemini AI reasoning to detect code vulnerabilities before deployment <span style={{ color: "#ffb829" }}>.</span>
          </motion.p>

          {/* CTA Buttons — Re-triggers on scroll up/down (once: false) */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.3 }}
            variants={FADE_UP}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              flexWrap: "wrap",
              marginBottom: "80px",
            }}
          >
            {/* Primary Violet Pill Action */}
            <Link to="/app">
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "#6b3df5", boxShadow: "0 0 35px rgba(128, 82, 255, 0.45)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "'Inter', ui-sans-serif, sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#ffffff",
                  backgroundColor: "#8052ff",
                  border: "none",
                  borderRadius: "22.5px",
                  padding: "13px 32px",
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  transition: "all 0.2s ease",
                  boxShadow: "0 0 20px rgba(128, 82, 255, 0.25)",
                }}
              >
                Launch Auditor Dashboard
                <ArrowRight size={15} />
              </motion.button>
            </Link>

            {/* Ghost Link */}
            <motion.a
              href="https://github.com/Piy26ush/SecureLens"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, borderColor: "rgba(255,255,255,0.4)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'Inter', ui-sans-serif, sans-serif",
                fontSize: "15px",
                fontWeight: 400,
                color: "#e0e0e0",
                backgroundColor: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "22.5px",
                padding: "13px 32px",
                cursor: "pointer",
                letterSpacing: "-0.01em",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <Github size={15} />
              View GitHub
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* DASHBOARD SHOWCASE — 3D Parallax Tilt & Re-triggering Scroll Entrance */}
      <section
        style={{
          padding: "0 clamp(16px, 5vw, 40px) 140px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: "1140px",
            marginLeft: "auto",
            marginRight: "auto",
            perspective: 1200,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.9, ease: EASING }}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{
              width: "100%",
              backgroundColor: "rgba(10, 10, 15, 0.9)",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 35px 90px -15px rgba(0, 0, 0, 0.95), 0 0 45px rgba(128, 82, 255, 0.2)",
              backdropFilter: "blur(20px)",
              transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transition: "transform 0.15s ease-out, box-shadow 0.3s ease",
              position: "relative",
            }}
          >
            {/* Ambient Cursor Spotlight Glare Overlay */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(600px circle at ${tilt.spotX}% ${tilt.spotY}%, rgba(128, 82, 255, 0.15), transparent 40%)`,
                pointerEvents: "none",
                zIndex: 2,
              }}
            />

            {/* Chrome Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 22px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                backgroundColor: "rgba(15, 15, 22, 0.95)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff5f56", display: "inline-block" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ffbd2e", display: "inline-block" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#27c93f", display: "inline-block" }} />
              </div>

              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  borderRadius: "22.5px",
                  padding: "5px 20px",
                  fontFamily: "'Inter', ui-sans-serif, sans-serif",
                  fontSize: "12px",
                  color: "#a0a0a0",
                  letterSpacing: "0.01em",
                  textAlign: "center",
                  maxWidth: "360px",
                  width: "100%",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                🔒 securelens.vercel.app/app
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#8052ff", fontWeight: 500 }}>
                <ShieldCheck size={14} />
                Live Node
              </div>
            </div>

            {/* Dashboard Screenshot */}
            <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
              <img
                src="/dashboard-preview.png"
                alt="SecureLens Auditor Dashboard"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  objectFit: "cover",
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
