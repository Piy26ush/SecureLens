import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "motion/react";
import { ShieldAlert, Zap, Cpu, CheckCircle } from "lucide-react";
import { useRef } from "react";

const EASING = [0.22, 1, 0.36, 1];

function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Number.isInteger(target) ? Math.round(latest) : latest.toFixed(1)
  );
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, target, { duration: 1.6, ease: "easeOut" });
      const unsub = rounded.on("change", (v) => setDisplayValue(v));
      return () => {
        controls.stop();
        unsub();
      };
    } else {
      count.set(0);
      setDisplayValue("0");
    }
  }, [isInView, target, count, rounded]);

  return (
    <span ref={ref}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

const STATS = [
  {
    icon: ShieldAlert,
    label: "Execution Risk",
    value: 0,
    suffix: "%",
    subtitle: "Pure Static AST Traversal",
    color: "#8052ff",
    slideFrom: "left" as const,
  },
  {
    icon: CheckCircle,
    label: "AST Grounded Findings",
    value: 100,
    suffix: "%",
    subtitle: "Zero Hallucination Anchor",
    color: "#22c55e",
    slideFrom: "right" as const,
  },
  {
    icon: Cpu,
    label: "Knowledge Retrieval",
    value: 3,
    suffix: "-Stage",
    subtitle: "OWASP & CWE RAG Pipeline",
    color: "#ffb829",
    slideFrom: "left" as const,
  },
  {
    icon: Zap,
    label: "Audit Efficiency",
    value: 2.5,
    prefix: "",
    suffix: "x",
    subtitle: "Faster Code Verification",
    color: "#06b6d4",
    slideFrom: "right" as const,
  },
];

export function StatsSection() {
  return (
    <section
      style={{
        backgroundColor: "#000000",
        padding: "clamp(60px, 8vh, 120px) clamp(16px, 5vw, 40px)",
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
        {/* Header — Re-triggers on scroll up & down */}
        <motion.div
          initial={{ opacity: 0, x: -70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: EASING }}
          style={{ marginBottom: "56px", textAlign: "center" }}
        >
          <p
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "12px",
              fontWeight: 400,
              color: "#8052ff",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Performance Metrics <span style={{ color: "#ffb829" }}>.</span>
          </p>
          <h2
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "clamp(30px, 4vw, 48px)",
              fontWeight: 200,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            Auditing benchmarks at scale <span style={{ color: "#ffb829" }}>.</span>
          </h2>
        </motion.div>

        {/* 4 Stat Cards Grid with Alternating Left/Right Scroll Slide Entrances */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
          }}
        >
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            const isLeft = stat.slideFrom === "left";

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: isLeft ? -70 : 70 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, ease: EASING, delay: i * 0.08 }}
                whileHover={{
                  y: -6,
                  borderColor: "rgba(128, 82, 255, 0.4)",
                  boxShadow: "0 20px 40px -15px rgba(128, 82, 255, 0.2)",
                }}
                style={{
                  backgroundColor: "rgba(10, 10, 15, 0.85)",
                  borderRadius: "20px",
                  padding: "32px 28px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(14px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Icon & Label Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span
                    style={{
                      fontFamily: "'Inter', ui-sans-serif, sans-serif",
                      fontSize: "13px",
                      fontWeight: 400,
                      color: "#a0a0a0",
                    }}
                  >
                    {stat.label}
                  </span>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      backgroundColor: "rgba(128, 82, 255, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={18} color={stat.color} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Animated Number Counter */}
                <div
                  style={{
                    fontFamily: "'Inter', ui-sans-serif, sans-serif",
                    fontSize: "clamp(36px, 4vw, 48px)",
                    fontWeight: 200,
                    color: "#ffffff",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                </div>

                {/* Subtitle */}
                <div
                  style={{
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "11px",
                    color: "#ffb829",
                    letterSpacing: "0.02em",
                  }}
                >
                  {stat.subtitle}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
