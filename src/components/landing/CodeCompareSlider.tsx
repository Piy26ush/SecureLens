import React, { useState, useRef } from "react";
import { ShieldCheck, AlertOctagon, CheckCircle2, Sliders } from "lucide-react";

export function CodeCompareSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(10, 10, 15, 0.85)",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "32px",
        backdropFilter: "blur(16px)",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9)",
        maxWidth: "960px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <p style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif", fontSize: "12px", color: "#8052ff", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
          Visual Vulnerability Drag Comparison <span style={{ color: "#ffb829" }}>.</span>
        </p>
        <h3 style={{ fontFamily: "'Inter', ui-sans-serif, sans-serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 200, color: "#ffffff", margin: 0 }}>
          Drag the slider to compare Vulnerable vs. Secure Fix <span style={{ color: "#ffb829" }}>.</span>
        </h3>
      </div>

      {/* Interactive Split Slider Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        style={{
          position: "relative",
          width: "100%",
          height: "300px",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          userSelect: "none",
          cursor: "col-resize",
        }}
      >
        {/* RIGHT LAYER: Secure AST Fix (Emerald Accent) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(34, 197, 94, 0.06)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#4ade80", fontSize: "13px", fontWeight: 500 }}>
            <CheckCircle2 size={16} />
            SECURE CODE (AST Parameterized Query)
          </div>

          <pre style={{ margin: 0, fontFamily: "'Fira Code', monospace", fontSize: "13px", color: "#4ade80", lineHeight: 1.6 }}>
            <code>{`def get_user(username: str):\n    conn = sqlite3.connect("app.db")\n    cursor = conn.cursor()\n    # Safe parameterized query prevents SQL injection\n    cursor.execute("SELECT * FROM users WHERE name = ?", (username,))\n    return cursor.fetchone()`}</code>
          </pre>

          <div style={{ fontSize: "11px", color: "#4ade80", opacity: 0.8 }}>
            ✓ Passed AST Static Analysis Engine
          </div>
        </div>

        {/* LEFT LAYER: Vulnerable Code (Red Accent) clipped by sliderPos */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${sliderPos}%`,
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            borderRight: "2px solid #8052ff",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f87171", fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap" }}>
            <AlertOctagon size={16} />
            VULNERABLE CODE (SQL Injection CWE-89)
          </div>

          <pre style={{ margin: 0, fontFamily: "'Fira Code', monospace", fontSize: "13px", color: "#f87171", lineHeight: 1.6, whiteSpace: "pre" }}>
            <code>{`def get_user(username: str):\n    conn = sqlite3.connect("app.db")\n    cursor = conn.cursor()\n    # Dangerous string concatenation\n    query = "SELECT * FROM users WHERE name = '" + username + "'"\n    cursor.execute(query)\n    return cursor.fetchone()`}</code>
          </pre>

          <div style={{ fontSize: "11px", color: "#f87171", opacity: 0.9, whiteSpace: "nowrap" }}>
            ⚠ Critical Risk: User input directly concatenated in SQL string
          </div>
        </div>

        {/* DRAG HANDLE */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `calc(${sliderPos}% - 18px)`,
            width: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            cursor: "col-resize",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#8052ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 0 20px rgba(128, 82, 255, 0.6)",
              border: "2px solid #ffffff",
            }}
          >
            <Sliders size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
