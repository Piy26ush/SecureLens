import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Github, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/experiment")({
  head: () => ({
    meta: [
      { title: "SecureLens — AI-Assisted Secure Code Auditor" },
      {
        name: "description",
        content:
          "Dala-styled experimental interface for SecureLens. Constellation floating on black velvet, weightless typography, and pure void canvas.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;700&display=swap",
      },
    ],
  }),
  component: LandingExperimentPage,
});

/* ---------- Motion primitives ---------- */
const easing = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easing },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

/* Reveal-on-scroll wrapper */
function Reveal({ children, className = "", variants = fadeUp }: { children: React.ReactNode; className?: string; variants?: any }) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`px-6 py-24 md:py-32 bg-[#000000] ${className}`}>
      <div className="mx-auto max-w-[1280px]">{children}</div>
    </section>
  );
}

/* ---------- Interactive HTML5 Canvas Particle Constellation ---------- */
function ParticleConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      angle: number;
      speed: number;
    }> = [];

    const colors = [
      "rgba(128, 82, 255, 0.6)", // Electric Iris (violet)
      "rgba(255, 184, 41, 0.6)",  // Saffron Spark (yellow)
      "rgba(21, 132, 110, 0.6)",  // Deep Verdant (teal)
      "rgba(236, 72, 153, 0.5)",  // Magenta
      "rgba(59, 130, 246, 0.5)",  // Blue
    ];

    // Initialize particles forming a shield/brain outline
    const totalParticles = 160;
    for (let i = 0; i < totalParticles; i++) {
      // Math to distribute particles in a shield shape
      const angle = (i / totalParticles) * Math.PI * 2;
      const r = 120 + Math.sin(angle * 5) * 15;
      
      // Shield geometry approximation
      let xOffset = Math.sin(angle) * r;
      let yOffset = -Math.cos(angle) * r;
      if (angle > Math.PI * 0.5 && angle < Math.PI * 1.5) {
        // Pull bottom point down to make shield shape
        yOffset += Math.sin(angle) * 30;
      }

      particles.push({
        x: width / 2 + xOffset,
        y: height / 2 + yOffset - 20,
        baseX: width / 2 + xOffset,
        baseY: height / 2 + yOffset - 20,
        size: Math.random() * 3 + 2,
        color: colors[i % colors.length],
        angle: Math.random() * Math.PI * 2,
        speed: 0.1 + Math.random() * 0.2,
      });
    }

    // Add some random ambient drifting particles
    const ambientCount = 40;
    for (let i = 0; i < ambientCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        size: Math.random() * 2 + 1,
        color: "rgba(128, 82, 255, 0.15)", // Low opacity violet
        angle: Math.random() * Math.PI * 2,
        speed: 0.05 + Math.random() * 0.1,
      });
    }

    function drawTriangle(x: number, y: number, size: number, color: string) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      const h = size * (Math.sqrt(3) / 2);
      ctx.moveTo(x, y - h / 2);
      ctx.lineTo(x - size / 2, y + h / 2);
      ctx.lineTo(x + size / 2, y + h / 2);
      ctx.closePath();
      ctx.stroke();
    }

    function render() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Draw connections first
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect nearby shield particles
          if (dist < 45 && i < totalParticles && j < totalParticles) {
            ctx.strokeStyle = `rgba(128, 82, 255, ${0.15 - dist / 300})`;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
          }
        }
      }
      ctx.stroke();

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.angle += p.speed * 0.05;
        // Floating movement
        p.x = p.baseX + Math.sin(p.angle) * 8;
        p.y = p.baseY + Math.cos(p.angle) * 8;

        drawTriangle(p.x, p.y, p.size * 2.5, p.color);
      });

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    function handleResize() {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      // Re-center base coordinates on resize
      particles.forEach((p, i) => {
        if (i < totalParticles) {
          const angle = (i / totalParticles) * Math.PI * 2;
          const r = 120 + Math.sin(angle * 5) * 15;
          let xOffset = Math.sin(angle) * r;
          let yOffset = -Math.cos(angle) * r;
          if (angle > Math.PI * 0.5 && angle < Math.PI * 1.5) {
            yOffset += Math.sin(angle) * 30;
          }
          p.baseX = width / 2 + xOffset;
          p.baseY = height / 2 + yOffset - 20;
        }
      });
    }

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full min-h-[400px] bg-transparent" />;
}

/* Circled SL Monogram Logo Lockup with Electric Iris gradient */
function LogoLockup() {
  return (
    <div className="flex items-center gap-3.5 font-semibold tracking-tight text-[#ffffff] font-sans">
      <div className="relative h-8 w-8 rounded-full flex items-center justify-center border border-[#8052ff]/20 bg-black">
        {/* Violet gradient triangle mark inside circle */}
        <div className="w-3 h-3 bg-gradient-to-br from-[#8052ff] to-[#15846e] clip-triangle" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
      </div>
      <span className="text-sm font-medium tracking-tight">SecureLens</span>
    </div>
  );
}

/* ---------- Nav ---------- */
function Nav() {
  const links = [
    ["Manifesto", "#manifesto"],
    ["Pipeline", "#pipeline"],
    ["Rule Set", "#rules"],
  ];
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: easing }}
      className="fixed inset-x-0 top-0 z-50 bg-[#000000]/70 backdrop-blur-none py-4"
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <LogoLockup />
        <nav className="hidden items-center gap-10 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-[14px] font-semibold uppercase tracking-[0.025em] text-[#9a9a9a] transition-colors hover:text-[#ffffff] font-sans"
            >
              {label}
            </a>
          ))}
        </nav>
        <Link
          to="/app"
          className="rounded-full bg-[#8052ff] px-[15.96px] py-[14.4px] text-[14px] font-semibold uppercase tracking-[0.025em] text-white transition-transform hover:scale-[1.03] font-sans"
        >
          Launch Auditor
        </Link>
      </div>
    </motion.header>
  );
}

/* ---------- Hero (Two-Column Asymmetric Split) ---------- */
function Hero() {
  return (
    <section className="relative min-h-[90vh] bg-[#000000] px-6 pt-36 md:pt-48 flex items-center">
      <div className="mx-auto w-full max-w-[1280px] grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline and body copy */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="md:col-span-7 flex flex-col items-start text-left"
        >
          <motion.div variants={fadeUp}>
            <span className="text-[14px] font-semibold uppercase tracking-[0.35px] text-[#ffb829] font-sans">
              v2.0 — Grounded Code Auditor
            </span>
          </motion.div>
          
          {/* Outsized weight-400 display headline - 113px, -4.52px tracking */}
          <motion.h1
            variants={fadeUp}
            className="mt-6 font-sans text-5xl md:text-7xl lg:text-[100px] xl:text-[113px] font-normal leading-[0.90] tracking-[-0.04em] text-[#ffffff]"
          >
            Review code <br />
            with clarity.
          </motion.h1>
          
          {/* Airy weight-200 body text - 18px */}
          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-[480px] font-sans text-[18px] font-extralight leading-[1.5] text-[#bdbdbd]"
          >
            SecureLens combines deterministic syntax checks with a persistent semantic context library to anchor LLM reviews in code facts.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10">
            <Link
              to="/app"
              className="inline-block rounded-full bg-[#8052ff] px-6 py-4 text-[14px] font-semibold uppercase tracking-[0.025em] text-white transition-transform hover:scale-[1.03] font-sans"
            >
              Audit Repository
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Column: Visual center particle system */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: easing }}
          className="md:col-span-5 h-[400px] md:h-[500px] w-full flex items-center justify-center"
        >
          <ParticleConstellation />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Manifesto Section (asymmetric reading rhythm) ---------- */
function Manifesto() {
  return (
    <section id="manifesto" className="bg-[#000000] px-6 py-28 md:py-36 border-t border-white/5">
      <div className="mx-auto w-full max-w-[1280px] grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Column: Oversized headline */}
        <div className="md:col-span-7">
          <Reveal>
            <h2 className="font-sans text-4xl md:text-6xl lg:text-[78px] font-normal leading-[1.1] tracking-[-3.12px] text-[#ffffff]">
              The review queue <br />
              is overflowing.
            </h2>
          </Reveal>
        </div>

        {/* Right Column: Text block with amber accent */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <Reveal>
            <span className="text-[14px] font-semibold uppercase tracking-[0.35px] text-[#ffb829] font-sans">
              THE CORE PROBLEM
            </span>
            <p className="mt-5 font-sans text-[18px] font-extralight leading-[1.5] text-[#bdbdbd]">
              Manual review does not scale, generic LLMs generate hallucinated security alerts, and legacy static checkers overwhelm teams with false flags. <br /><br />
              SecureLens bridges the gap by anchoring LLM cascades directly to deterministic syntax markings and local persistent knowledge stores.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Pipeline (How it works - asymmetric zigzag) ---------- */
function Pipeline() {
  const steps = [
    ["Ingestion", "Drag and drop local python code folders recursively directly in-browser."],
    ["AST Parser", "Run deterministic syntax analysis targeting SQL injection & traversal."],
    ["Vector RAG", "Query a persistent local ChromaDB using offline ONNX embeddings in-flight."],
    ["Cascade AI", "Process grounded facts through structured verification models."],
    ["Citations", "Export ReportLab PDF findings with direct links to code line numbers."],
  ];
  return (
    <section id="pipeline" className="bg-[#000000] px-6 py-28 md:py-36 border-t border-white/5">
      <div className="mx-auto w-full max-w-[1280px] grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Column: Steps pipeline list */}
        <div className="md:col-span-6 flex flex-col gap-10">
          <Reveal>
            <span className="text-[14px] font-semibold uppercase tracking-[0.35px] text-[#ffb829] font-sans">
              THE PIPELINE
            </span>
            <div className="mt-8 space-y-8 font-sans">
              {steps.map(([title, desc], i) => (
                <div key={title} className="flex gap-6 items-start">
                  <span className="text-[14px] font-semibold text-[#8052ff]">0{i + 1}</span>
                  <div>
                    <h4 className="text-[18px] font-normal text-white">{title}</h4>
                    <p className="mt-1 text-sm font-extralight text-[#9a9a9a] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right Column: Oversized headline */}
        <div className="md:col-span-6 flex items-center">
          <Reveal>
            <h2 className="font-sans text-3xl md:text-5xl lg:text-[60px] font-normal leading-[1.1] tracking-[-1.68px] text-[#ffffff]">
              AST syntax trees <br />
              mapped directly to <br />
              <span className="text-[#8052ff]">semantic vectors.</span>
            </h2>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Rule Set / Features (No card borders, float on black void) ---------- */
function Rules() {
  const items = [
    {
      title: "Deterministic AST Engine",
      tag: "SYNTAX CHECKING",
      desc: "Static scans verify syntax markers against CWE-89 (SQL Injection) and CWE-22 (Path Traversal), guaranteeing reproducible alerts."
    },
    {
      title: "ChromaDB Vector Store",
      tag: "SEMANTIC LOOKUPS",
      desc: "An offline database matches contextual queries against rules locally using fast, pre-compiled ONNX embeddings."
    },
    {
      title: "Grounded LLM Cascade",
      tag: "REASONING FILTERS",
      desc: "Structured evaluation loops analyze verified AST trees against security models to filter out false alerts."
    }
  ];
  return (
    <section id="rules" className="bg-[#000000] px-6 py-28 md:py-36 border-t border-white/5 font-sans">
      <div className="mx-auto w-full max-w-[1280px]">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.35px] text-[#ffb829] font-sans">
            CORE ARCHITECTURE
          </span>
          <h2 className="mt-6 font-sans text-4xl md:text-6xl lg:text-[78px] font-normal leading-[1.1] tracking-[-3.12px] text-[#ffffff] max-w-3xl">
            Built for confidence, not developer noise.
          </h2>
        </Reveal>

        {/* 3 columns of floating elements (no panels, no card containers, float on void) */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-20 grid gap-12 md:grid-cols-3"
        >
          {items.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="flex flex-col items-start gap-3"
            >
              <span className="text-[12px] font-semibold tracking-wider text-[#8052ff] uppercase">{item.tag}</span>
              <h3 className="text-2xl font-normal text-white">{item.title}</h3>
              <p className="mt-2 text-sm font-extralight text-[#9a9a9a] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Tech Stack Section ---------- */
function Tech() {
  const tech = [
    "Python 3.12",
    "ONNX Runtime",
    "ChromaDB Persistent",
    "ReportLab PDF Renderer",
    "React 19",
    "Tailwind CSS v4",
    "Vite 8",
    "TanStack Router",
    "Framer Motion",
    "Gemini 1.5 Flash",
  ];
  return (
    <section id="tech" className="bg-[#000000] px-6 py-28 md:py-36 border-t border-white/5 font-sans">
      <div className="mx-auto w-full max-w-[1280px]">
        <Reveal>
          <span className="text-[14px] font-semibold uppercase tracking-[0.35px] text-[#ffb829] font-sans">
            TECH STACK
          </span>
          <h2 className="mt-6 font-sans text-3xl md:text-5xl lg:text-[60px] font-normal leading-[1.1] tracking-[-1.68px] text-[#ffffff]">
            Modern foundations.
          </h2>
        </Reveal>
        
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 flex flex-wrap gap-3"
        >
          {tech.map((t) => (
            <motion.span
              key={t}
              variants={fadeUp}
              className="rounded-full border border-white/10 px-5 py-3 text-[14px] font-semibold uppercase tracking-[0.025em] text-[#d4d4d4] bg-transparent hover:border-[#8052ff]/30 transition-colors"
            >
              {t}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="bg-[#000000] px-6 py-16 font-sans">
      <div className="mx-auto max-w-[1280px]">
        {/* Low-contrast divider */}
        <div className="h-px bg-white/5 w-full mb-12" />
        
        <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div>
            <LogoLockup />
            <p className="mt-3 max-w-xs text-xs text-[#9a9a9a] leading-relaxed font-extralight">
              Grounded, AI-assisted Python security review before every deploy.
            </p>
          </div>
          <div className="flex gap-10 text-xs font-semibold uppercase tracking-[0.025em] text-[#9a9a9a]">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <Link to="/app" className="hover:text-white transition-colors">Auditor</Link>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-10 text-[11px] font-semibold uppercase tracking-widest text-white/20">
          © {new Date().getFullYear()} SecureLens. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ---------- Landing Experiment Page ---------- */
export default function LandingExperimentPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#000000]" />;
  }

  return (
    <>
      <style>{`
        /* Local overrides to force weightless/airy PPNeueMontreal typography styling */
        .font-sans {
          font-family: 'Inter', -apple-system, sans-serif !important;
        }
      `}</style>
      <div className="min-h-screen bg-[#000000] text-[#ffffff] antialiased overflow-x-hidden selection:bg-[#8052ff]/20">
        <Nav />
        <main>
          <Hero />
          <Manifesto />
          <Pipeline />
          <Rules />
          <Tech />
        </main>
        <Footer />
      </div>
    </>
  );
}
