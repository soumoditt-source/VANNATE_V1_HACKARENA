"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { translations, Language } from "@/lib/i18n";
import { useAITTS } from "@/lib/useAITTS";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState<Language>("en");
  const t = translations[lang];
  const { speak, stop, voicesReady } = useAITTS();
  const router = useRouter();

  const handleLanguageSelect = (selectedLang: Language) => {
    setLang(selectedLang);
    const textToSpeak = translations[selectedLang].voiceGreeting;
    if (voicesReady) speak(textToSpeak, selectedLang);
  };

  const nextStep = () => {
    stop();
    if (step < 3) {
      setStep(step + 1);
      // Automatically speak the Vasudhaiva Kutumbakam if entering step 2
      if (step === 1 && voicesReady) {
        setTimeout(() => {
          speak(translations[lang].vasudhaivaDesc, lang);
        }, 500);
      }
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="page-shell" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* Dynamic Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(circle at center, rgba(20,184,166,0.1) 0%, var(--bg-main) 70%)" }} />
      <div style={{ position: "absolute", top: "10%", left: "10%", width: "40vw", height: "40vw", background: "var(--teal)", filter: "blur(150px)", opacity: 0.1, borderRadius: "50%", animation: "pulse 8s infinite alternate" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: "30vw", height: "30vw", background: "var(--gold)", filter: "blur(150px)", opacity: 0.08, borderRadius: "50%", animation: "pulse 10s infinite alternate-reverse" }} />

      <div style={{ zIndex: 1, width: "100%", maxWidth: "600px", padding: "2rem" }}>
        
        {/* Progress Bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: "3rem", justifyContent: "center" }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ height: 4, width: 40, borderRadius: 2, background: s <= step ? "var(--teal)" : "var(--glass-border)", transition: "background 0.5s ease" }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
              <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{t.chooseLanguage}</h1>
              <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Experience Vannate in your native voice.</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <button className={`btn-outline ${lang === "en" ? "active" : ""}`} onClick={() => handleLanguageSelect("en")} style={{ width: "100%", justifyContent: "center", padding: "1rem", borderColor: lang === "en" ? "var(--teal)" : "var(--glass-border)", background: lang === "en" ? "rgba(20,184,166,0.1)" : "transparent" }}>
                  English (India)
                </button>
                <button className={`btn-outline ${lang === "hi" ? "active" : ""}`} onClick={() => handleLanguageSelect("hi")} style={{ width: "100%", justifyContent: "center", padding: "1rem", borderColor: lang === "hi" ? "var(--teal)" : "var(--glass-border)", background: lang === "hi" ? "rgba(20,184,166,0.1)" : "transparent" }}>
                  हिंदी (Hindi)
                </button>
                <button className={`btn-outline ${lang === "bn" ? "active" : ""}`} onClick={() => handleLanguageSelect("bn")} style={{ width: "100%", justifyContent: "center", padding: "1rem", borderColor: lang === "bn" ? "var(--teal)" : "var(--glass-border)", background: lang === "bn" ? "rgba(20,184,166,0.1)" : "transparent" }}>
                  বাংলা (Bengali)
                </button>
              </div>

              <button className="btn-primary" onClick={nextStep} style={{ marginTop: "3rem", width: "100%" }}>
                {t.continue} &rarr;
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
              
              <div style={{ width: "120px", height: "120px", margin: "0 auto 2rem", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--teal)", padding: 4 }}>
                <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=250&auto=format&fit=crop" alt="World" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
              </div>

              <h2 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--gold)", fontFamily: "var(--font-playfair)", marginBottom: "1rem", lineHeight: 1.1 }}>
                {t.vasudhaiva}
              </h2>
              <p style={{ fontSize: "1.2rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                {t.vasudhaivaDesc}
              </p>

              <button className="btn-primary" onClick={nextStep} style={{ marginTop: "3rem", width: "100%" }}>
                {t.continue} &rarr;
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
              <div style={{ width: "80px", height: "80px", background: "rgba(20,184,166,0.1)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{t.welcome}</h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "3rem" }}>{t.description}</p>
              
              <button className="btn-primary" onClick={nextStep} style={{ width: "100%", fontSize: "1.1rem", padding: "1.2rem" }}>
                {t.step3} &rarr;
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
