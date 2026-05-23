"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [newsEnabled, setNewsEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("news_enabled");
    if (saved !== null) {
      setNewsEnabled(saved === "true");
    }
  }, []);

  if (!mounted) return null;

  const toggleNews = () => {
    const newVal = !newsEnabled;
    setNewsEnabled(newVal);
    localStorage.setItem("news_enabled", String(newVal));
    // Dispatch a custom event so other components can instantly react
    window.dispatchEvent(new Event("settings_updated"));
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "140px",
          zIndex: 50,
          background: "var(--glass)",
          border: "1px solid var(--border)",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
        }}
        aria-label="Settings Menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: "fixed",
              bottom: "80px",
              right: "140px",
              zIndex: 51,
              background: "rgba(10,10,10,0.85)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "24px",
              width: "320px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.8)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, color: "#fff", fontSize: "1.1rem" }}>System Settings</h3>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "#fff", fontWeight: 600 }}>Global News Feed</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 4 }}>
                  Enable live disaster reports
                </div>
              </div>
              <button 
                onClick={toggleNews}
                style={{
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  background: newsEnabled ? "var(--teal)" : "var(--border)",
                  border: "none",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 0.3s"
                }}
              >
                <div style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: "3px",
                  left: newsEnabled ? "23px" : "3px",
                  transition: "left 0.3s",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }} />
              </button>
            </div>
            
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "0.75rem", textAlign: "center" }}>
              VANNATE OS v1.0
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
