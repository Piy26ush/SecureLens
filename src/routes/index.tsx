import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { TechMarquee } from "@/components/landing/TechMarquee";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ArchitectureSection } from "@/components/landing/ArchitectureSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
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
      <LandingNav />

      {/* Hero Section */}
      <HeroSection />

      {/* Infinite Tech Stack Marquee Ticker */}
      <TechMarquee />

      {/* Core 3 Security Pillars */}
      <FeaturesSection />

      {/* Animated Rolling Counter Stat Cards */}
      <StatsSection />

      {/* 5-Stage Architecture Pipeline */}
      <ArchitectureSection />
      <ProblemSection />
      <ShowcaseSection />
      <TechSection />
      <LandingFooter />
    </div>
  );
}
