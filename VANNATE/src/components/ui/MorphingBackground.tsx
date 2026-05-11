"use client";

import { motion } from "framer-motion";

export default function MorphingBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background: "var(--bg-main)",
        transition: "background 0.4s ease",
      }}
    >
      <svg
        style={{ position: "absolute", width: 0, height: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          width: "100%",
          height: "100%",
          filter: "url(#goo)",
          position: "absolute",
          opacity: 0.6,
        }}
      >
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, 50, 150, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "20%",
            left: "20%",
            width: "50vw",
            height: "50vw",
            background: "radial-gradient(circle, rgba(20,184,166,0.3) 0%, transparent 70%)",
            borderRadius: "50%",
            mixBlendMode: "screen",
          }}
        />

        <motion.div
          animate={{
            x: [0, -150, 100, 0],
            y: [0, 100, -50, 0],
            scale: [1, 0.8, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 2,
          }}
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: "45vw",
            height: "45vw",
            background: "radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)",
            borderRadius: "50%",
            mixBlendMode: "screen",
          }}
        />

        <motion.div
          animate={{
            x: [0, 50, -100, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.4, 0.8, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 5,
          }}
          style={{
            position: "absolute",
            top: "40%",
            left: "40%",
            width: "40vw",
            height: "40vw",
            background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
            borderRadius: "50%",
            mixBlendMode: "screen",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.5,
          maskImage: "radial-gradient(circle at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 80%)",
        }}
      />
    </div>
  );
}
