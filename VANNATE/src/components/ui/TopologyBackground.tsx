"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

export default function TopologyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Build particles — teal swirling spiral + gold dust
    const particles: Particle[] = [];
    const SWIRL = 4000;
    const DUST = 1200;

    for (let i = 0; i < SWIRL; i++) {
      const r = Math.sqrt(i / SWIRL) * Math.min(W, H) * 0.52;
      const theta = i * 2.39996;
      const cx = W / 2 + r * Math.cos(theta);
      const cy = H / 2 + r * Math.sin(theta) * 0.45 + (Math.random() - 0.5) * r * 0.22;
      particles.push({
        x: cx, y: cy, z: Math.random(),
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.04,
        size: Math.random() * 1.6 + 0.4,
        color: `hsl(${174 + Math.random() * 18},${78 + Math.random() * 18}%,${45 + Math.random() * 20}%)`,
        opacity: 0.35 + Math.random() * 0.45,
      });
    }

    for (let i = 0; i < DUST; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.06,
        size: Math.random() * 1.2 + 0.3,
        color: `hsl(${38 + Math.random() * 16},${88}%,${56 + Math.random() * 10}%)`,
        opacity: 0.15 + Math.random() * 0.25,
      });
    }

    let rotation = 0;

    const render = () => {
      W = canvas.width;
      H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      rotation += 0.0008;
      const mx = mouseRef.current.x - 0.5;
      const my = mouseRef.current.y - 0.5;
      const scrollY = window.scrollY;
      const scrollFactor = scrollY * 0.0003;

      const cosR = Math.cos(rotation + mx * 0.15);
      const sinR = Math.sin(rotation + mx * 0.15);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift
        p.x += p.vx + mx * 0.12;
        p.y += p.vy + my * 0.06 + scrollFactor * 0.8;

        // Wrap around edges
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;

        // Rotate around center for swirl
        if (i < SWIRL) {
          const dx = p.x - W / 2;
          const dy = p.y - H / 2;
          const nx = dx * cosR - dy * sinR * 0.0012 + W / 2;
          const ny = dx * sinR * 0.0012 + dy * cosR + H / 2;
          p.x += (nx - p.x) * 0.002;
          p.y += (ny - p.y) * 0.001;
        }

        const depth = 0.6 + p.z * 0.4;
        const size = p.size * depth;

        ctx.globalAlpha = p.opacity * depth;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(render);
    };

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "var(--bg-main)", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />
      {/* Depth vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 30%, var(--bg-main) 110%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, var(--bg-main) 100%)", pointerEvents: "none" }} />
    </div>
  );
}
