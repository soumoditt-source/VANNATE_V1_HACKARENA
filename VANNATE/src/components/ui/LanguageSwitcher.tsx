"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function LanguageSwitcher() {
  const { currentLang, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;


  const languages = [
    { code: "en", label: "Eng" },
    { code: "hi", label: "हिंदी" },
    { code: "bn", label: "বাংলা" }
  ] as const;

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "80px", zIndex: 9000 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: "absolute",
              bottom: "100%",
              right: 0,
              marginBottom: "10px",
              background: "rgba(10,10,10,0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { 
                  setLanguage(lang.code); 
                  setIsOpen(false); 
                  // Set Google Translate Cookie
                  document.cookie = `googtrans=/en/${lang.code}; path=/;`;
                  document.cookie = `googtrans=/en/${lang.code}; path=/; domain=${window.location.hostname};`;
                  window.location.reload();
                }}
                style={{
                  background: currentLang === lang.code ? "var(--teal)" : "transparent",
                  color: currentLang === lang.code ? "#000" : "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.2s ease"
                }}
              >
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "var(--teal)",
          color: "#000",
          border: "none",
          boxShadow: "0 4px 15px rgba(20,184,166,0.4)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "1.1rem"
        }}
      >
        {languages.find(l => l.code === currentLang)?.label.substring(0,2).toUpperCase()}
      </button>
    </div>
  );
}
