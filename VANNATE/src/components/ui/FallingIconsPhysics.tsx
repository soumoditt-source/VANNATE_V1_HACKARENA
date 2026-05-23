"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

export default function FallingIconsPhysics() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Curated, elegant humanitarian symbols
  const icons = ["🛡️", "❤️", "⚕️", "🌍", "🤝", "🕊️", "💧", "📦"];
  
  // Randomize initial positions for a pure CSS/Framer Motion physics simulation
  const items = useMemo(() => {
    return icons.map((icon, i) => ({
      id: i,
      icon,
      left: 10 + Math.random() * 80, // Random X position (10% to 90%)
      duration: 15 + Math.random() * 20, // Super slow, heavy floating
      delay: Math.random() * 10,
      size: 60 + Math.random() * 40, // Random bubble size
    }));
  }, []);

  return (
    <section style={{ height: "100vh", position: "relative", background: "var(--bg-secondary)", overflow: "hidden" }}>
      
      {/* HTML Background Content */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10, pointerEvents: "none" }}>
        <h2 style={{ fontSize: "clamp(3rem, 6vw, 6rem)", fontWeight: 900, fontFamily: "var(--font-playfair)", textAlign: "center", color: "#fff", textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
          Every Resource.<br />
          <span style={{ color: "var(--teal)" }}>Physically Tracked.</span>
        </h2>
        <p style={{ fontSize: "1.2rem", color: "var(--text-muted)", marginTop: "1rem", maxWidth: "600px", textAlign: "center" }}>
          This isn't just data; these are real lives, real supplies, and real impact.
        </p>
      </div>

      {/* 2D Glass Bubble Physics (Zero WebGL Overhead) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden" }}>
        {mounted && items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ y: "110vh", x: "-50%", opacity: 0 }}
            animate={{ 
              y: "-20vh", 
              opacity: [0, 1, 1, 0],
              rotate: [0, 90, -90, 0]
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              position: "absolute",
              left: `${item.left}%`,
              width: item.size,
              height: item.size,
              background: "rgba(20,184,166,0.1)",
              border: "1px solid rgba(20,184,166,0.3)",
              backdropFilter: "blur(4px)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: item.size * 0.4,
              boxShadow: "0 10px 30px rgba(0,0,0,0.2), inset 0 0 20px rgba(20,184,166,0.2)",
              userSelect: "none"
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
