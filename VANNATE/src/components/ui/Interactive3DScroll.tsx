"use client";

import { useEffect, useRef, useState } from "react";

const slides = [
  {
    title: "The AI Core.",
    text: "The heart of Vannate is a decentralized neural network. Every donation, every alert, every pulse of aid is analyzed in real-time.",
    align: "left",
    accent: "#14b8a6",
    icon: "⬡",
  },
  {
    title: "360° Visibility.",
    text: "Watch the system adapt. From donor intention to ground reality, the AI dynamically bridges the gap, ensuring zero waste.",
    align: "right",
    accent: "#f59e0b",
    icon: "◎",
  },
  {
    title: "Flawless Execution.",
    text: "This isn't a spreadsheet. This is a living, breathing humanitarian operating system.",
    align: "center",
    accent: "#6ee7b7",
    icon: "✦",
  },
];

function AnimatedOrb({ accent, phase }: { accent: string; phase: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 320;
    canvas.width = SIZE;
    canvas.height = SIZE;

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      t += 0.012;

      const cx = SIZE / 2;
      const cy = SIZE / 2;

      // Glowing core
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
      grd.addColorStop(0, accent + "bb");
      grd.addColorStop(0.5, accent + "44");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.fill();

      // Wireframe rings
      for (let ring = 0; ring < 3; ring++) {
        const r = 60 + ring * 40;
        const tilt = (ring * Math.PI) / 3 + phase;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * (0.4 + ring * 0.2) * (ring % 2 === 0 ? 1 : -1));
        ctx.scale(1, 0.35 + Math.sin(t * 0.7 + tilt) * 0.15);
        ctx.strokeStyle = accent + (ring === 0 ? "cc" : ring === 1 ? "88" : "44");
        ctx.lineWidth = ring === 0 ? 1.5 : 1;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Orbiting particles
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + t * (1 + i * 0.1);
        const orbit = 100 + Math.sin(t * 0.5 + i) * 12;
        const px = cx + Math.cos(angle) * orbit;
        const py = cy + Math.sin(angle) * orbit * 0.38;
        const alpha = 0.5 + Math.sin(t * 2 + i) * 0.3;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [accent, phase]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 280, height: 280, filter: `drop-shadow(0 0 40px ${accent}66)` }}
    />
  );
}

export default function Interactive3DScroll() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = parseInt(entry.target.getAttribute("data-idx") || "0");
          if (entry.isIntersecting) setActive(idx);
        });
      },
      { threshold: 0.6 }
    );

    const slides = section.querySelectorAll("[data-idx]");
    slides.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ background: "#020202", position: "relative", overflow: "hidden" }}
    >
      {/* Ambient glow bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${slides[active].accent}0a 0%, transparent 70%)`,
          transition: "background 0.8s ease",
          pointerEvents: "none",
        }}
      />

      {slides.map((slide, i) => (
        <div
          key={i}
          data-idx={i}
          style={{
            minHeight: "92vh",
            display: "flex",
            alignItems: "center",
            justifyContent:
              slide.align === "left"
                ? "flex-start"
                : slide.align === "right"
                ? "flex-end"
                : "center",
            padding: "0 clamp(2rem, 10vw, 12vw)",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5vw",
              flexDirection: slide.align === "right" ? "row-reverse" : "row",
              flexWrap: "wrap",
              maxWidth: 1100,
              opacity: active === i ? 1 : 0.2,
              transform: active === i ? "translateY(0)" : "translateY(32px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            {/* Orb */}
            <div style={{ flex: "0 0 auto" }}>
              <AnimatedOrb accent={slide.accent} phase={(i * Math.PI) / 3} />
            </div>

            {/* Text */}
            <div style={{ flex: "1 1 300px", textAlign: slide.align === "center" ? "center" : "left" }}>
              <div
                style={{
                  fontSize: "2.8rem",
                  marginBottom: "1rem",
                  filter: `drop-shadow(0 0 20px ${slide.accent})`,
                }}
              >
                {slide.icon}
              </div>
              <h2
                style={{
                  fontSize: "clamp(2.2rem, 5.5vw, 4.5rem)",
                  fontWeight: 900,
                  fontFamily: "var(--font-playfair, 'Playfair Display', serif)",
                  color: "#fff",
                  lineHeight: 1.1,
                  marginBottom: "1.2rem",
                }}
              >
                {slide.title}
              </h2>
              <p
                style={{
                  fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
                  color: "#94a3b8",
                  lineHeight: 1.75,
                  maxWidth: 540,
                }}
              >
                {slide.text}
              </p>
              <div
                style={{
                  marginTop: "2rem",
                  width: 56,
                  height: 3,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${slide.accent}, transparent)`,
                  marginLeft: slide.align === "center" ? "auto" : undefined,
                  marginRight: slide.align === "center" ? "auto" : undefined,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
