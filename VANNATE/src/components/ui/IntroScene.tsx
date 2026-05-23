"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  color: string; life: number; maxLife: number;
}

// ─── Cinematic script ────────────────────────────────────────────────────────
const SCRIPT = [
  { id: 0, duration: 5500, primary: "दातव्यमिति यद्दानं दीयतेऽनुपकारिणे।", secondary: "Charity given without expectation of return is the purest Dharma.", sub: "— Bhagavad Gita 17.20", isTitle: false },
  { id: 1, duration: 4500, primary: "The world is not saved by algorithms.", secondary: "It is saved by human kindness, amplified by intelligence.", sub: "", isTitle: false },
  { id: 2, duration: 5000, primary: "वसुधैव कुटुम्बकम्", secondary: "The entire world is one family.", sub: "— Maha Upanishad", isTitle: false },
  { id: 3, duration: 99999, primary: "VANNATE AI", secondary: "The Architecture of Dharma", sub: "Humanity · Karma · Compassion", isTitle: true },
];

export default function IntroScene() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [step, setStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [pageOut, setPageOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => { setMounted(true); }, []);

  // Advance script steps
  useEffect(() => {
    if (!mounted || step >= SCRIPT.length - 1) return;
    const d = SCRIPT[step].duration;
    const t = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setStep(s => s + 1);
        setFadeOut(false);
        setFadeIn(true);
        setTimeout(() => setFadeIn(false), 1200);
      }, 800);
    }, d);
    setFadeIn(true);
    setTimeout(() => setFadeIn(false), 1200);
    return () => clearTimeout(t);
  }, [step, mounted]);

  const handleEnter = useCallback(() => {
    setPageOut(true);
    setTimeout(() => router.push("/"), 1000);
  }, [router]);

  // ─── Canvas: Sudarshana Chakra + particles ────────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    // Spawn divine particles
    function spawnParticles(t: number) {
      if (Math.random() < 0.35) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 100 + Math.random() * 60;
        const cx = W / 2, cy = H * 0.38;
        const gold = Math.random() > 0.6;
        particlesRef.current.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 1.2,
          vy: -Math.random() * 1.5 - 0.5,
          size: Math.random() * 2.5 + 0.5,
          opacity: 0.9,
          color: gold
            ? `hsl(${42 + Math.random() * 16}, 100%, ${62 + Math.random() * 15}%)`
            : `hsl(${174 + Math.random() * 12}, 90%, ${52 + Math.random() * 18}%)`,
          life: 0,
          maxLife: 80 + Math.random() * 80,
        });
      }
    }

    // Draw Sudarshana Chakra
    function drawChakra(t: number) {
      const cx = W / 2, cy = H * 0.38;
      const r = Math.min(W, H) * 0.14;
      const rot = t * 0.04;
      const innerRot = -t * 0.08;
      const pulse = 1 + Math.sin(t * 0.12) * 0.04;

      ctx.save();
      ctx.translate(cx, cy);

      // Outer glow rings
      for (let g = 3; g >= 1; g--) {
        ctx.beginPath();
        ctx.arc(0, 0, r * pulse * (1 + g * 0.18), 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * (1 + g * 0.22));
        glow.addColorStop(0, `rgba(255, 190, 0, 0.0)`);
        glow.addColorStop(1, `rgba(255, 160, 0, ${0.07 / g})`);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      // ── Outer serrated ring ──
      const spokes = 32;
      ctx.save();
      ctx.rotate(rot);
      for (let i = 0; i < spokes; i++) {
        const a = (i * Math.PI * 2) / spokes;
        const a2 = ((i + 0.5) * Math.PI * 2) / spokes;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * 0.85 * pulse, Math.sin(a) * r * 0.85 * pulse);
        ctx.lineTo(Math.cos(a2) * r * 1.12 * pulse, Math.sin(a2) * r * 1.12 * pulse);
        ctx.lineTo(Math.cos(a + (Math.PI * 2) / spokes) * r * 0.85 * pulse, Math.sin(a + (Math.PI * 2) / spokes) * r * 0.85 * pulse);
        ctx.closePath();
        const grad = ctx.createLinearGradient(
          Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85,
          Math.cos(a2) * r * 1.15, Math.sin(a2) * r * 1.15
        );
        grad.addColorStop(0, "#f59e0b");
        grad.addColorStop(1, "#fbbf24");
        ctx.fillStyle = grad;
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 12;
        ctx.fill();
      }
      ctx.restore();

      // ── Main outer circle ──
      ctx.save();
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.arc(0, 0, r * pulse, 0, Math.PI * 2);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#fbbf24";
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.restore();

      // ── Inner 6-pointed star (counter-rotating) ──
      ctx.save();
      ctx.rotate(innerRot);
      const starPoints = 6;
      ctx.beginPath();
      for (let i = 0; i < starPoints * 2; i++) {
        const angle = (i * Math.PI) / starPoints - Math.PI / 2;
        const rr = i % 2 === 0 ? r * 0.65 * pulse : r * 0.35 * pulse;
        if (i === 0) ctx.moveTo(Math.cos(angle) * rr, Math.sin(angle) * rr);
        else ctx.lineTo(Math.cos(angle) * rr, Math.sin(angle) * rr);
      }
      ctx.closePath();
      ctx.strokeStyle = "#fde68a";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#fde68a";
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.restore();

      // ── Inner spokes (16) ──
      ctx.save();
      ctx.rotate(rot * 1.5);
      for (let i = 0; i < 16; i++) {
        const a = (i * Math.PI * 2) / 16;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * r * 0.78 * pulse, Math.sin(a) * r * 0.78 * pulse);
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.4 + Math.sin(t * 0.1 + i) * 0.2})`;
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#f59e0b";
        ctx.stroke();
      }
      ctx.restore();

      // ── Inner circle (hub) ──
      const hub = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.22 * pulse);
      hub.addColorStop(0, "#ffffff");
      hub.addColorStop(0.3, "#fde68a");
      hub.addColorStop(1, "rgba(245,158,11,0)");
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.22 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = hub;
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
    }

    // Draw dark divine silhouette (abstract Krishna)
    function drawSilhouette() {
      const cx = W / 2, baseY = H * 0.72;
      const scale = Math.min(W, H) * 0.001;

      ctx.save();
      ctx.globalAlpha = 0.85;

      // Body
      const bodyGrad = ctx.createLinearGradient(cx - 30 * scale, baseY - 160 * scale, cx + 30 * scale, baseY);
      bodyGrad.addColorStop(0, "#0a0a14");
      bodyGrad.addColorStop(1, "#06060e");
      ctx.fillStyle = bodyGrad;

      // Torso
      ctx.beginPath();
      ctx.ellipse(cx, baseY - 80 * scale, 28 * scale, 55 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(cx, baseY - 150 * scale, 22 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Peacock feather glow
      ctx.beginPath();
      ctx.ellipse(cx + 18 * scale, baseY - 175 * scale, 6 * scale, 18 * scale, -0.4, 0, Math.PI * 2);
      const featherGrad = ctx.createLinearGradient(
        cx + 12 * scale, baseY - 190 * scale,
        cx + 24 * scale, baseY - 160 * scale
      );
      featherGrad.addColorStop(0, "rgba(20,184,166,0.8)");
      featherGrad.addColorStop(1, "rgba(59,130,246,0.4)");
      ctx.fillStyle = featherGrad;
      ctx.shadowColor = "#14b8a6";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Left arm (flute)
      ctx.beginPath();
      ctx.fillStyle = "#0a0a14";
      ctx.ellipse(cx - 45 * scale, baseY - 90 * scale, 10 * scale, 35 * scale, -0.5, 0, Math.PI * 2);
      ctx.fill();

      // Flute glow
      ctx.beginPath();
      ctx.moveTo(cx - 20 * scale, baseY - 110 * scale);
      ctx.lineTo(cx - 65 * scale, baseY - 60 * scale);
      ctx.strokeStyle = "rgba(212,175,55,0.7)";
      ctx.lineWidth = 3 * scale;
      ctx.shadowColor = "#d4af37";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Right arm (raised for Chakra)
      ctx.beginPath();
      ctx.fillStyle = "#0a0a14";
      ctx.ellipse(cx + 46 * scale, baseY - 105 * scale, 10 * scale, 38 * scale, 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Legs / dhoti swirl
      ctx.beginPath();
      ctx.ellipse(cx - 12 * scale, baseY - 20 * scale, 18 * scale, 40 * scale, 0.1, 0, Math.PI * 2);
      ctx.fillStyle = "#070712";
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 14 * scale, baseY - 18 * scale, 16 * scale, 38 * scale, -0.15, 0, Math.PI * 2);
      ctx.fill();

      // Golden crown glow
      const crownGrad = ctx.createRadialGradient(cx, baseY - 168 * scale, 2, cx, baseY - 168 * scale, 20 * scale);
      crownGrad.addColorStop(0, "rgba(255,200,50,0.6)");
      crownGrad.addColorStop(1, "rgba(255,200,50,0)");
      ctx.beginPath();
      ctx.arc(cx, baseY - 168 * scale, 20 * scale, 0, Math.PI * 2);
      ctx.fillStyle = crownGrad;
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // Draw star field
    const stars: { x: number; y: number; r: number; flicker: number }[] = [];
    for (let i = 0; i < 280; i++) {
      stars.push({
        x: Math.random() * 2000, y: Math.random() * 1200,
        r: Math.random() * 1.2 + 0.1,
        flicker: Math.random() * Math.PI * 2,
      });
    }

    function drawStars(t: number) {
      stars.forEach(s => {
        const alpha = 0.3 + Math.sin(t * 0.02 + s.flicker) * 0.3;
        ctx.beginPath();
        ctx.arc((s.x % W), (s.y % H), s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
    }

    function drawParticles() {
      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
      particlesRef.current.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy -= 0.01; // slow float up
        p.life++;
        const progress = p.life / p.maxLife;
        p.opacity = (1 - progress) * 0.9;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    const render = () => {
      timeRef.current++;
      const t = timeRef.current;

      // Background
      const bg = ctx.createRadialGradient(W / 2, H * 0.38, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      bg.addColorStop(0, "#080c1c");
      bg.addColorStop(0.5, "#04060f");
      bg.addColorStop(1, "#020308");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      drawStars(t);
      drawSilhouette();
      drawChakra(t);
      spawnParticles(t);
      drawParticles();

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [mounted]);

  if (!mounted) return null;

  const current = SCRIPT[step];

  return (
    <div
      style={{
        width: "100vw", height: "100vh",
        background: "#020308",
        overflow: "hidden", position: "relative",
        opacity: pageOut ? 0 : 1,
        transition: "opacity 1s ease-in-out",
        cursor: current.isTitle ? "pointer" : "default",
      }}
      onClick={current.isTitle ? handleEnter : undefined}
    >
      {/* Canvas background — Chakra + silhouette */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Cinematic dark vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 38%, transparent 28%, rgba(2,3,8,0.55) 80%)",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "35%",
        background: "linear-gradient(to bottom, transparent, rgba(2,3,8,0.98))",
        pointerEvents: "none",
      }} />

      {/* Text Overlay */}
      <div
        key={step}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0 6vw 8vh",
          display: "flex", flexDirection: "column",
          alignItems: current.isTitle ? "center" : "flex-start",
          textAlign: current.isTitle ? "center" : "left",
          opacity: fadeOut ? 0 : fadeIn ? 0 : 1,
          transform: fadeOut ? "translateY(20px)" : fadeIn ? "translateY(20px)" : "translateY(0)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
          animation: !fadeIn && !fadeOut ? "introTextIn 1s ease forwards" : "none",
        }}
      >
        {/* Sanskrit / Primary text */}
        <p style={{
          fontFamily: current.isTitle ? "'Playfair Display', Georgia, serif" : "Georgia, serif",
          fontSize: current.isTitle
            ? "clamp(3.5rem, 8vw, 7rem)"
            : "clamp(1.4rem, 2.8vw, 2.4rem)",
          fontWeight: current.isTitle ? 900 : 400,
          color: current.isTitle ? "#f59e0b" : "#fff",
          lineHeight: 1.2,
          marginBottom: "1rem",
          textShadow: current.isTitle
            ? "0 0 60px rgba(245,158,11,0.5), 0 4px 30px rgba(0,0,0,0.9)"
            : "0 4px 20px rgba(0,0,0,0.9)",
          letterSpacing: current.isTitle ? "0.06em" : "0.02em",
        }}>
          {current.primary}
        </p>

        {/* Translation / secondary */}
        <p style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: current.isTitle
            ? "clamp(1rem, 1.8vw, 1.4rem)"
            : "clamp(0.95rem, 1.5vw, 1.2rem)",
          color: current.isTitle ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.55)",
          lineHeight: 1.65,
          marginBottom: current.sub ? "0.5rem" : 0,
          fontWeight: 400,
          maxWidth: current.isTitle ? "600px" : "720px",
          letterSpacing: current.isTitle ? "0.12em" : "0",
          textTransform: current.isTitle ? "uppercase" : "none",
        }}>
          {current.secondary}
        </p>

        {current.sub && (
          <p style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(0.75rem, 1vw, 0.9rem)",
            color: "rgba(245,158,11,0.6)",
            letterSpacing: "0.1em",
          }}>
            {current.sub}
          </p>
        )}

        {/* CTA on final step */}
        {current.isTitle && (
          <button
            onClick={handleEnter}
            style={{
              marginTop: "2.5rem",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.45)",
              color: "#f59e0b",
              padding: "14px 42px",
              fontSize: "0.88rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              borderRadius: "50px",
              cursor: "pointer",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 30px rgba(245,158,11,0.12)",
              transition: "all 0.35s ease",
              animation: "ctaPulse 2.5s ease-in-out infinite",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(245,158,11,0.22)";
              e.currentTarget.style.boxShadow = "0 0 50px rgba(245,158,11,0.35)";
              e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(245,158,11,0.1)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(245,158,11,0.12)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Awaken System ✦
          </button>
        )}
      </div>

      {/* Step progress dots */}
      <div style={{
        position: "absolute", bottom: "3.5vh", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", gap: "8px",
      }}>
        {SCRIPT.map((_, i) => (
          <div key={i} style={{
            width: i === step ? "24px" : "6px",
            height: "6px", borderRadius: "3px",
            background: i === step ? "#f59e0b" : "rgba(255,255,255,0.2)",
            transition: "all 0.4s ease",
          }} />
        ))}
      </div>

      {/* Top logo badge */}
      <div style={{
        position: "absolute", top: "3vh", left: "5vw",
        display: "flex", alignItems: "center", gap: "10px",
        opacity: 0.65,
      }}>
        <div style={{
          width: "28px", height: "28px", borderRadius: "50%",
          border: "1.5px solid rgba(245,158,11,0.5)",
          background: "rgba(245,158,11,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px",
        }}>✦</div>
        <span style={{
          fontFamily: "Georgia, serif",
          fontSize: "0.82rem",
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
        }}>Vannate AI</span>
      </div>

      {/* Skip button */}
      {!current.isTitle && (
        <button
          onClick={handleEnter}
          style={{
            position: "absolute", top: "3vh", right: "5vw",
            background: "none", border: "none",
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.8rem", letterSpacing: "0.15em",
            textTransform: "uppercase", cursor: "pointer",
            transition: "color 0.3s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}
        >
          Skip →
        </button>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;600&display=swap');
        @keyframes introTextIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.12); }
          50%       { box-shadow: 0 0 45px rgba(245,158,11,0.28); }
        }
      `}</style>
    </div>
  );
}
