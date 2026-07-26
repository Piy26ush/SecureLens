import { motion } from "motion/react";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "var(--landing-canvas)",
        padding: "64px clamp(16px, 5vw, 40px) 48px",
        borderTop: "1px solid var(--landing-slate-hr)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--landing-max-width)",
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {/* Left branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
        </div>

        {/* Center links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <a
            href="https://github.com/Piy26ush/SecureLens"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "13px",
              color: "var(--landing-stone)",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fdfdfd")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--landing-stone)")}
          >
            GitHub
          </a>
          <a
            href="https://github.com/Piy26ush/SecureLens/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Inter', ui-sans-serif, sans-serif",
              fontSize: "13px",
              color: "var(--landing-stone)",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fdfdfd")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--landing-stone)")}
          >
            Documentation
          </a>
        </div>

        {/* Right copyright & author info */}
        <div
          style={{
            fontFamily: "'Inter', ui-sans-serif, sans-serif",
            fontSize: "13px",
            color: "var(--landing-stone)",
          }}
        >
          Built by{" "}
          <span style={{ color: "var(--landing-pearl)" }}>Piyush Waghjale</span>{" "}
          &copy; {currentYear}
        </div>
      </div>
    </footer>
  );
}
