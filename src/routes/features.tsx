import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LandingNav } from "@/components/landing/LandingNav";
import { MicroAuditorSandbox } from "@/components/landing/MicroAuditorSandbox";
import { VulnerabilityMatrix } from "@/components/landing/VulnerabilityMatrix";
import { PdfReportShowcase } from "@/components/landing/PdfReportShowcase";
import { CliTerminal } from "@/components/landing/CliTerminal";
import { ThreeDHeroCanvas } from "@/components/landing/ThreeDHeroCanvas";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "SecureLens Capabilities — Interactive Security Suite" },
      {
        name: "description",
        content:
          "Explore SecureLens interactive capabilities: live AST sandbox, vulnerability radar matrix, executive PDF reports, and CLI terminal integration.",
      },
    ],
  }),
  component: CapabilitiesPage,
});

function CapabilitiesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ backgroundColor: "#000000", minHeight: "100vh" }} />;
  }

  return (
    <div
      style={{
        backgroundColor: "#000000",
        color: "#ffffff",
        minHeight: "100vh",
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* 3D Canvas Background */}
      <ThreeDHeroCanvas />

      {/* Navigation Bar */}
      <LandingNav />

      {/* PAGE HERO HEADER */}
      <section
        style={{
          padding: "clamp(120px, 16vh, 160px) clamp(16px, 5vw, 40px) 40px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
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
                marginBottom: "24px",
              }}
            >
              <Sparkles size={13} className="text-[#8052ff]" />
              Interactive Security Capabilities <span style={{ color: "#ffb829" }}>.</span>
            </span>

            <h1
              style={{
                fontFamily: "'Inter', ui-sans-serif, sans-serif",
                fontSize: "clamp(40px, 6vw, 72px)",
                fontWeight: 200,
                color: "#ffffff",
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                margin: "0 0 20px",
              }}
            >
              Security Tools & Engine Suite <span style={{ color: "#8052ff" }}>.</span>
            </h1>

            <p
              style={{
                fontFamily: "'Inter', ui-sans-serif, sans-serif",
                fontSize: "clamp(16px, 2vw, 19px)",
                fontWeight: 400,
                color: "#a0a0a0",
                lineHeight: 1.6,
                maxWidth: "640px",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "40px",
              }}
            >
              Test the static AST auditor, inspect threat vectors, preview executive PDF deliverables, and run CLI terminal commands.
            </p>

            <Link to="/app">
              <motion.button
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
                  padding: "12px 28px",
                  fontSize: "14px",
                  fontFamily: "'Inter', ui-sans-serif, sans-serif",
                  fontWeight: 500,
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(128, 82, 255, 0.3)",
                }}
              >
                Launch Full Auditor App
                <ArrowRight size={15} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 1. Live Micro-Auditor Sandbox */}
      <section style={{ padding: "60px 24px", position: "relative", zIndex: 1 }}>
        <MicroAuditorSandbox />
      </section>

      {/* 2. Vulnerability Class Radar Matrix */}
      <VulnerabilityMatrix />

      {/* 3. Executive Security PDF Report Showcase */}
      <PdfReportShowcase />

      {/* 4. Interactive Security CLI Terminal */}
      <CliTerminal />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
