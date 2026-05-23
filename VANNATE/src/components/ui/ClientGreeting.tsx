"use client";

import { useEffect, useRef } from "react";
import { useAITTS } from "@/lib/useAITTS";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function ClientGreeting() {
  const { speak } = useAITTS();
  const { currentLang } = useLanguage();
  const hasGreeted = useRef(false);

  useEffect(() => {
    if (hasGreeted.current) return;
    
    // Slight delay so the page loads and the user processes the UI before the voice kicks in
    const timer = setTimeout(() => {
      let greeting = "Welcome back to the Vannate Humanitarian Platform. Humans are for humans, and above all is humanity.";
      
      if (currentLang === "hi") {
        greeting = "वन्नाटे मानवीय मंच पर आपका स्वागत है। इंसान इंसान के लिए है, और मानवता सबसे ऊपर है।";
      } else if (currentLang === "bn") {
        greeting = "ভ্যানটে মানবিক প্ল্যাটফর্মে আপনাকে স্বাগত। মানুষ মানুষের জন্য, সবার উপরে মানুষ সত্য, তাহার উপরে নাই।";
      }
      
      speak(greeting, currentLang);
      hasGreeted.current = true;
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentLang, speak]);

  return null;
}
