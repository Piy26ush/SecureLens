import React, { useEffect, useRef } from "react";

interface Beam {
  x: number;
  y: number;
  length: number;
  speed: number;
  dir: "horizontal" | "vertical";
  color: string;
}

export function LaserGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const gridSize = 60;

    // Generate traveling grid laser beams
    const beamColors = ["#8052ff", "#ffb829", "#06b6d4"];
    const beams: Beam[] = [];
    const beamCount = 14;

    for (let i = 0; i < beamCount; i++) {
      const isHoriz = Math.random() > 0.5;
      beams.push({
        x: isHoriz ? -200 : Math.floor((Math.random() * width) / gridSize) * gridSize,
        y: isHoriz ? Math.floor((Math.random() * height) / gridSize) * gridSize : -200,
        length: Math.random() * 160 + 100,
        speed: Math.random() * 2 + 1.5,
        dir: isHoriz ? "horizontal" : "vertical",
        color: beamColors[i % beamColors.length],
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render traveling laser beams along grid lines
      beams.forEach((b) => {
        if (b.dir === "horizontal") {
          b.x += b.speed;
          if (b.x > width + b.length) {
            b.x = -b.length;
            b.y = Math.floor((Math.random() * height) / gridSize) * gridSize;
          }

          const grad = ctx.createLinearGradient(b.x - b.length, b.y, b.x, b.y);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.7, b.color);
          grad.addColorStop(1, "#ffffff");

          ctx.beginPath();
          ctx.moveTo(b.x - b.length, b.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.shadowColor = b.color;
          ctx.shadowBlur = 12;
          ctx.stroke();
        } else {
          b.y += b.speed;
          if (b.y > height + b.length) {
            b.y = -b.length;
            b.x = Math.floor((Math.random() * width) / gridSize) * gridSize;
          }

          const grad = ctx.createLinearGradient(b.x, b.y - b.length, b.x, b.y);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.7, b.color);
          grad.addColorStop(1, "#ffffff");

          ctx.beginPath();
          ctx.moveTo(b.x, b.y - b.length);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.shadowColor = b.color;
          ctx.shadowBlur = 12;
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
}
