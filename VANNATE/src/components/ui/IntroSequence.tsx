"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function IntroSequence() {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.sessionStorage.getItem("vannate-intro-seen") !== "true";
  });

  useEffect(() => {
    if (showIntro) {
      // AI Voice Introduction
      try {
        if ("speechSynthesis" in window) {
          const msg = new SpeechSynthesisUtterance("Welcome to Vannate. The Humanitarian Operating System.");
          msg.rate = 0.9;
          msg.pitch = 1.0;
          msg.volume = 1.0;
          
          // Optionally pick a voice if available
          const voices = window.speechSynthesis.getVoices();
          const femaleVoice = voices.find(v => v.name.includes("Female") || v.name.includes("Google UK English Female"));
          if (femaleVoice) msg.voice = femaleVoice;

          window.speechSynthesis.speak(msg);
        }
      } catch (err) {
        console.warn("Speech synthesis error:", err);
      }

      // Sequence timing
      setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem("vannate-intro-seen", "true");
      }, 5500); // 5.5 seconds for the whole intro
    }
  }, [showIntro]);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="intro-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "var(--bg-main)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Live Video Background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              opacity: 0.4,
              overflow: "hidden"
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "contrast(1.2) brightness(0.8) hue-rotate(180deg)", // gives it a teal/tech vibe
              }}
            >
              <source src="https://cdn.coverr.co/videos/coverr-abstract-blue-and-purple-particles-8610/1080p.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Additional morphing blur for depth */}
          <div
            style={{
              position: "absolute",
              width: "150%",
              height: "150%",
              background: "radial-gradient(circle at 50% 50%, rgba(20,184,166,0.15) 0%, transparent 50%)",
              filter: "blur(60px)",
              zIndex: 0,
            }}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            style={{ position: "relative", zIndex: 1, textAlign: "center" }}
          >
            <motion.h1
              initial={{ filter: "blur(10px)" }}
              animate={{ filter: "blur(0px)" }}
              transition={{ duration: 1.5, delay: 0.5 }}
              style={{
                fontSize: "4rem",
                fontWeight: 900,
                letterSpacing: "-1px",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px"
              }}
            >
              <span style={{ color: "var(--teal)", fontFamily: "'Playfair Display', serif", fontSize: "5rem" }}>
                V
              </span>
              ANNATE
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2 }}
              style={{
                color: "var(--text-muted)",
                fontSize: "1.1rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textShadow: "0 0 20px rgba(0,0,0,0.5)"
              }}
            >
              Humanitarian OS
            </motion.p>
          </motion.div>

          {/* Scanning line effect */}
          <motion.div
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.5, delay: 1, ease: "linear" }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "3px",
              background: "linear-gradient(90deg, transparent, var(--teal), transparent)",
              boxShadow: "0 0 20px var(--teal)",
              zIndex: 2,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
