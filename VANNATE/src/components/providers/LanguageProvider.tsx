"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi" | "bn";

interface LanguageContextType {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLangState] = useState<Language>("en");

  useEffect(() => {
    // Load from local storage if exists
    const saved = localStorage.getItem("vannate-lang") as Language;
    if (saved && ["en", "hi", "bn"].includes(saved)) {
      setCurrentLangState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setCurrentLangState(lang);
    localStorage.setItem("vannate-lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
