"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NewsItem = {
  id: string;
  title: string;
  date: string;
  url: string;
  source: string;
};

export default function LiveNewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initial check
    const saved = localStorage.getItem("news_enabled");
    if (saved !== null) setEnabled(saved === "true");

    const handleSettings = () => {
      const current = localStorage.getItem("news_enabled");
      setEnabled(current !== "false");
    };

    window.addEventListener("settings_updated", handleSettings);
    return () => window.removeEventListener("settings_updated", handleSettings);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (data.articles) {
          const formatted = data.articles.map((a: any, i: number) => ({
            id: i.toString(),
            title: a.title,
            date: new Date(a.publishedAt).toLocaleDateString(),
            url: a.url,
            source: a.source.name
          }));
          setNews(formatted.slice(0, 5));
        }
      } catch (err) {
        console.error("News fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, [enabled]);

  useEffect(() => {
    if (news.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 6000); // Rotate news every 6 seconds
    return () => clearInterval(interval);
  }, [news]);

  if (!mounted) return null;

  return (
    <div style={{ background: "rgba(20, 184, 166, 0.05)", border: "1px solid rgba(20, 184, 166, 0.2)", borderRadius: "16px", padding: "1.5rem", overflow: "hidden", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "red", animation: "pulse 1.5s infinite" }} />
        <h3 style={{ color: "var(--teal)", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Live Global Intelligence</h3>
      </div>
      
      <div style={{ height: "100px", position: "relative" }}>
        {!enabled ? (
          <div style={{ color: "var(--text-muted)", fontStyle: "italic", display: "flex", alignItems: "center", gap: "8px", height: "100%" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            Global Intelligence Feed Offline
          </div>
        ) : loading ? (
          <div style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Intercepting signals...</div>
        ) : news.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ position: "absolute", width: "100%" }}
            >
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                {news[currentIndex].source} &middot; {news[currentIndex].date}
              </div>
              <a href={news[currentIndex].url} target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "none", fontSize: "1.1rem", fontWeight: 600, lineHeight: 1.4, display: "block" }}>
                {news[currentIndex].title}
              </a>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div style={{ color: "var(--text-muted)" }}>No signal available.</div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
        }
      `}} />
    </div>
  );
}
