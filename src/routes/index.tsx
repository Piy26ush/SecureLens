import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { ArchitectureSection } from "@/components/landing/ArchitectureSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ShowcaseSection } from "@/components/landing/ShowcaseSection";
import { TechSection } from "@/components/landing/TechSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SecureLens — AI-Assisted Secure Code Auditor" },
      {
        name: "description",
        content:
          "Deterministic AST analysis, semantic security context retrieval, and Gemini AI reasoning combined for enterprise-grade Python security audits.",
      },
      { property: "og:title", content: "SecureLens — AI-Assisted Secure Code Auditor" },
      {
        property: "og:description",
        content: "Scan Python code for injection, traversal and misuse vulnerabilities.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ backgroundColor: "var(--landing-canvas)", minHeight: "100vh" }} />;
  }
  return (
    <div
      style={{
        backgroundColor: "var(--landing-canvas)",
        color: "var(--landing-paper)",
        minHeight: "100vh",
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <LandingNav />
      <HeroSection />
      <ProblemSection />
      <ArchitectureSection />
      <FeaturesSection />
      <ShowcaseSection />
      <TechSection />
      <LandingFooter />
    </div>
  );
}
