import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Architecture", href: "#architecture" },
  {
    label: "GitHub",
    href: "https://github.com/Piy26ush/SecureLens",
    external: true,
  },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAnchor = (href: string) => (e: React.MouseEvent) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        height: "64px",
        backgroundColor: scrolled ? "rgba(5,5,5,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "background-color 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease",
        maxWidth: "100%",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
        }}
      >
        <img
          src="/favicon.png"
          alt="SecureLens Logo"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "'Inter', ui-sans-serif, sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            color: "#fdfdfd",
            letterSpacing: "-0.01em",
          }}
        >
          SecureLens
        </span>
      </Link>

      {/* Center links */}
      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            onClick={!link.external ? handleAnchor(link.href) : undefined}
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              color: "#d4d4d4",
              textDecoration: "none",
              letterSpacing: "0.01em",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fdfdfd")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#d4d4d4")}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <Link to="/app">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            fontFamily: "'Inter', ui-sans-serif, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            color: "#fdfdfd",
            backgroundColor: "#6366F1",
            border: "none",
            borderRadius: "9999px",
            padding: "8px 20px",
            cursor: "pointer",
            letterSpacing: "-0.01em",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#4f46e5")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#6366F1")
          }
        >
          Launch SecureLens
        </motion.button>
      </Link>
    </motion.nav>
  );
}
