import { motion } from "motion/react";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function ProblemSection() {
  return (
    <section
      style={{
        backgroundColor: "var(--landing-canvas)",
        padding: "clamp(64px, 8vh, 120px) clamp(16px, 5vw, 40px)",
      }}
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        style={{
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <motion.p
          variants={FADE_UP}
          style={{
            fontFamily: "'Inter', ui-sans-serif, sans-serif",
            fontSize: "clamp(24px, 3.5vw, 36px)",
            fontWeight: 400,
            color: "var(--landing-paper)",
            lineHeight: 1.13,
            letterSpacing: "-0.02em",
            margin: "0 0 20px",
          }}
        >
          Modern AI coding assistants generate code faster than ever.
        </motion.p>
        <motion.p
          variants={FADE_UP}
          style={{
            fontFamily: "'Inter', ui-sans-serif, sans-serif",
            fontSize: "clamp(24px, 3.5vw, 36px)",
            fontWeight: 400,
            color: "var(--landing-ash)",
            lineHeight: 1.13,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          SecureLens helps developers ensure that code is{" "}
          <span style={{ color: "var(--landing-paper)" }}>secure</span> before
          deployment.
        </motion.p>
      </motion.div>
    </section>
  );
}
