import React, { useEffect, useRef, useState } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export function ThreeDHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth || 1200);
    let height = (canvas.height = window.innerHeight || 800);

    // 1. Generate 3D Octahedron / Security Shield Geometry Vertices
    const rawVertices: Point3D[] = [
      { x: 0, y: 1.6, z: 0 },   // Top apex
      { x: 0, y: -1.6, z: 0 },  // Bottom apex
      { x: 1.4, y: 0, z: 0 },   // Right
      { x: -1.4, y: 0, z: 0 },  // Left
      { x: 0, y: 0, z: 1.4 },   // Front
      { x: 0, y: 0, z: -1.4 },  // Back
    ];

    const baseRadius = 140;
    const vertices = rawVertices.map((v) => ({
      x: v.x * baseRadius,
      y: v.y * baseRadius,
      z: v.z * baseRadius,
    }));

    // Octahedron Edges
    const edges: [number, number][] = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2],
    ];

    // 2. Generate Concentric 3D Orbital Rings
    const generateRingPoints = (radius: number, count: number, tiltX: number, tiltZ: number) => {
      const points: Point3D[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        let x = Math.cos(angle) * radius;
        let y = Math.sin(angle) * radius;
        let z = 0;

        let y1 = y * Math.cos(tiltX) - z * Math.sin(tiltX);
        let z1 = y * Math.sin(tiltX) + z * Math.cos(tiltX);
        let x2 = x * Math.cos(tiltZ) - y1 * Math.sin(tiltZ);
        let y2 = x * Math.sin(tiltZ) + y1 * Math.cos(tiltZ);

        points.push({ x: x2, y: y2, z: z1 });
      }
      return points;
    };

    const ring1 = generateRingPoints(260, 80, Math.PI / 4, Math.PI / 6);
    const ring2 = generateRingPoints(360, 100, -Math.PI / 3, Math.PI / 4);

    // 3. Floating Security Synapse Particles
    const particleCount = Math.min(90, Math.floor(width / 18));
    const particles: (Point3D & { vx: number; vy: number; vz: number; size: number; alpha: number; color: string })[] = [];

    const colors = ["rgba(128, 82, 255, 0.6)", "rgba(255, 184, 41, 0.5)", "rgba(6, 182, 212, 0.5)", "rgba(168, 85, 247, 0.5)"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1400,
        y: (Math.random() - 0.5) * 1200,
        z: (Math.random() - 0.5) * 800,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        vz: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.5 + 0.2,
        color: colors[i % colors.length],
      });
    }

    // Scroll & Mouse Tracking
    let scrollY = window.scrollY || 0;
    let targetScrollY = scrollY;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY || 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const mx = e.clientX / (window.innerWidth || 1200) - 0.5;
      const my = e.clientY / (window.innerHeight || 800) - 0.5;
      targetMouseX = mx * 1.5;
      targetMouseY = my * -1.5;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth || 1200;
      height = canvas.height = window.innerHeight || 800;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const fov = 650;

    // 3D Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse & scroll
      scrollY += (targetScrollY - scrollY) * 0.08;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const docH = typeof document !== "undefined" ? document.body.scrollHeight : 2000;
      const maxScroll = Math.max(1, docH - height);
      const scrollProgress = Math.min(1, Math.max(0, scrollY / maxScroll));

      const time = Date.now() * 0.0006;
      const rotX = time * 0.5 + scrollProgress * Math.PI * 2.5 + mouseY;
      const rotY = time * 0.7 + scrollProgress * Math.PI * 3 + mouseX;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const centerYOffset = -scrollY * 0.15 + Math.sin(time * 2) * 20;

      const project = (p: Point3D, scaleFactor = 1) => {
        let x = p.x * scaleFactor;
        let y = p.y * scaleFactor;
        let z = p.z * scaleFactor;

        // Rotate Y
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        // Rotate X
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;

        // Perspective Projection
        const dist = fov / (fov + z2 + 450);
        return {
          sx: width / 2 + x1 * dist,
          sy: height / 2 + centerYOffset + y2 * dist,
          sz: z2,
          scale: dist,
        };
      };

      // 1. Draw Floating Security Particle Galaxy
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (Math.abs(p.x) > 750) p.vx *= -1;
        if (Math.abs(p.y) > 650) p.vy *= -1;
        if (Math.abs(p.z) > 500) p.vz *= -1;

        const proj = project(p, 0.9);
        ctx.beginPath();
        ctx.arc(proj.sx, proj.sy, Math.max(0.5, p.size * proj.scale), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = "#8052ff";
        ctx.shadowBlur = 10;
        ctx.fill();

        // Connect nearby particles with subtle synapse lines
        for (let j = idx + 1; j < particles.length; j += 3) {
          const p2 = particles[j];
          const proj2 = project(p2, 0.9);
          const dx = proj.sx - proj2.sx;
          const dy = proj.sy - proj2.sy;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(proj.sx, proj.sy);
            ctx.lineTo(proj2.sx, proj2.sy);
            ctx.strokeStyle = `rgba(128, 82, 255, ${(1 - d / 140) * 0.18})`;
            ctx.lineWidth = 0.8;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      });

      // 2. Draw 3D Orbital Halos (Indigo & Cyan)
      ctx.beginPath();
      ring1.forEach((pt, i) => {
        const proj = project(pt, 1 + scrollProgress * 0.2);
        if (i === 0) ctx.moveTo(proj.sx, proj.sy);
        else ctx.lineTo(proj.sx, proj.sy);
      });
      ctx.closePath();
      ctx.strokeStyle = "rgba(128, 82, 255, 0.35)";
      ctx.lineWidth = 1.6;
      ctx.shadowColor = "#8052ff";
      ctx.shadowBlur = 12;
      ctx.stroke();

      ctx.beginPath();
      ring2.forEach((pt, i) => {
        const proj = project(pt, 1.05 + scrollProgress * 0.25);
        if (i === 0) ctx.moveTo(proj.sx, proj.sy);
        else ctx.lineTo(proj.sx, proj.sy);
      });
      ctx.closePath();
      ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 3. Draw 3D Floating Octahedron Shield Edges
      const projVerts = vertices.map((v) => project(v));

      edges.forEach(([i, j]) => {
        const p1 = projVerts[i];
        const p2 = projVerts[j];

        const alpha = Math.max(0.15, Math.min(0.85, (p1.scale + p2.scale) / 2 - 0.15));

        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.strokeStyle = `rgba(128, 82, 255, ${alpha})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = "#8052ff";
        ctx.shadowBlur = 14;
        ctx.stroke();
      });

      // 4. Draw 3D Vertex Glowing Spheres
      projVerts.forEach((pv) => {
        ctx.beginPath();
        ctx.arc(pv.sx, pv.sy, 4 * pv.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ffb829";
        ctx.shadowBlur = 14;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted]);

  if (!mounted) return null;

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
      }}
    />
  );
}
