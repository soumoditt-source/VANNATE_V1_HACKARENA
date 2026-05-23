"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

function Frame({
  image,
  title,
  subtitle,
  accent,
  layout = "center",
  progress,
  range,
}: {
  image: string;
  title: string;
  subtitle: string;
  accent: string;
  layout?: "center" | "left" | "right";
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number, number, number];
}) {
  const [inStart, inEnd, outStart, outEnd] = range;
  const y = useTransform(progress, [inStart, inEnd, outStart, outEnd], ["80px", "0px", "0px", "-80px"]);
  const opacity = useTransform(progress, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0]);
  const scale = useTransform(progress, [inStart, inEnd], [0.96, 1]);

  return (
    <motion.div
      style={{ y, opacity, scale, position: "absolute", inset: 0 }}
    >
      {/* Full bleed background image */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Image src={image} alt={title} fill style={{ objectFit: "cover" }} priority />
        {/* Dark gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: layout === "center"
            ? "linear-gradient(to top, rgba(5,5,5,0.92) 30%, rgba(5,5,5,0.4) 60%, rgba(5,5,5,0.2) 100%)"
            : layout === "left"
              ? "linear-gradient(to right, rgba(5,5,5,0.95) 40%, rgba(5,5,5,0.2) 100%)"
              : "linear-gradient(to left, rgba(5,5,5,0.95) 40%, rgba(5,5,5,0.2) 100%)"
        }} />
      </div>

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: layout === "center" ? "flex-end" : "center",
        alignItems: layout === "center" ? "center" : layout === "left" ? "flex-start" : "flex-end",
        padding: layout === "center" ? "0 2rem 10vh 2rem" : "0 6vw",
        textAlign: layout === "center" ? "center" : layout === "left" ? "left" : "right",
        maxWidth: layout === "center" ? "800px" : undefined,
        margin: layout === "center" ? "0 auto" : undefined,
        left: layout === "center" ? 0 : undefined,
        right: layout === "center" ? 0 : undefined,
      }}>
        <span style={{
          display: "inline-block",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: accent,
          marginBottom: "1rem",
          padding: "6px 14px",
          border: `1px solid ${accent}55`,
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          background: `${accent}18`,
        }}>
          Vannate
        </span>
        <h2 style={{
          fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
          fontWeight: 900,
          fontFamily: "'Playfair Display', serif",
          lineHeight: 1.1,
          color: "#fff",
          textShadow: "0 4px 30px rgba(0,0,0,0.6)",
          marginBottom: "1.2rem",
          maxWidth: "700px",
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: "clamp(1rem, 2vw, 1.3rem)",
          color: "rgba(255,255,255,0.75)",
          lineHeight: 1.7,
          maxWidth: "560px",
          fontWeight: 300,
        }}>
          {subtitle}
        </p>

        {/* Progress line */}
        <div style={{ marginTop: "2.5rem", width: "60px", height: "3px", background: accent, borderRadius: "2px", boxShadow: `0 0 10px ${accent}` }} />
      </div>
    </motion.div>
  );
}

export default function ScrollJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} style={{ height: "350vh", position: "relative", zIndex: 10 }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        <Frame
          image="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"
          title="The Genesis of Trust"
          subtitle="We started with a simple belief: humanity's generosity should never be lost in the dark. Every rupee deserves a story."
          accent="#14b8a6"
          layout="center"
          progress={scrollYProgress}
          range={[0, 0.08, 0.22, 0.32]}
        />

        <Frame
          image="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop"
          title="Bridging The Gap"
          subtitle="AI precision meets human empathy. Every contribution flows exactly where it's needed — matched, verified, confirmed."
          accent="#f59e0b"
          layout="left"
          progress={scrollYProgress}
          range={[0.3, 0.38, 0.55, 0.65]}
        />

        <Frame
          image="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop"
          title="Vasudhaiva Kutumbakam"
          subtitle="The World is One Family. Ancient Sanskrit wisdom, made digital. Welcome to the future of verified compassion."
          accent="#22c55e"
          layout="right"
          progress={scrollYProgress}
          range={[0.63, 0.72, 0.9, 1.0]}
        />

        {/* Scroll indicator */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            zIndex: 10,
          }}
        >
          <span>Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: "1px", height: "30px", background: "rgba(255,255,255,0.4)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
