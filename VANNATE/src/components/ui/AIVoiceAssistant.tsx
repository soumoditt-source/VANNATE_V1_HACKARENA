"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMic } from "@/lib/useMic";
import { useAITTS } from "@/lib/useAITTS";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AIVoiceAssistant() {
  const { currentLang } = useLanguage();
  const { isRecording, isProcessing, transcript, startRecording, stopRecording } = useMic();
  const { speak, isPlaying, stop } = useAITTS();
  const [aiResponse, setAiResponse] = useState("");
  const [thinking, setThinking] = useState(false);

  const handleReasoning = useCallback(async (text: string) => {
    setThinking(true);
    setAiResponse("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text, language: currentLang })
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setAiResponse(data.reply);
        speak(data.reply, currentLang);
      } else {
        throw new Error(data.error || "Failed to parse reply");
      }
    } catch (error) {
      console.error("Reasoning error:", error);
      const fallbackMsg = "I am here to help you. Let me know what you need.";
      setAiResponse(fallbackMsg);
      speak(fallbackMsg, currentLang);
    } finally {
      setThinking(false);
    }
  }, [currentLang, speak]);

  // When a new transcript arrives from STT, send it for reasoning
  useEffect(() => {
    if (transcript && !isRecording && !isProcessing) {
      handleReasoning(transcript);
    }
  }, [transcript, isRecording, isProcessing, handleReasoning]);

  const isBusy = isRecording || isProcessing || thinking || isPlaying;
  const langLabel = currentLang === "hi" ? "Hindi" : currentLang === "bn" ? "Bengali" : "English";

  return (
    <div style={{
      padding: "1.5rem",
      background: "rgba(20,184,166,0.05)",
      borderRadius: "24px",
      border: "1px solid rgba(20,184,166,0.2)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem"
    }}>
      <div style={{ textAlign: "center" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "0.2rem", color: "var(--teal)" }}>Vannate AI Assistant</h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Ask a question or request help in {langLabel}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onMouseLeave={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        aria-label={isRecording ? "Stop recording" : "Hold to speak"}
        style={{
          width: 70, height: 70, borderRadius: "50%",
          background: isRecording ? "var(--critical, #e11d48)" : isPlaying ? "var(--purple, #8b5cf6)" : "var(--teal)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: isRecording
            ? "0 0 20px rgba(225,29,72,0.6)"
            : isPlaying
            ? "0 0 30px rgba(139,92,246,0.6)"
            : "0 4px 15px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease"
        }}
      >
        {/* Mic icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {isPlaying ? (
            <path d="M3 18v-6a9 9 0 0 1 18 0v6M3 18a3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H4a1 1 0 0 0-1 1v3Zm18 0a3 3 0 0 1-3 3h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3a1 1 0 0 1 1 1v3Z" />
          ) : (
            <>
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </>
          )}
        </svg>
      </motion.button>

      {isPlaying && (
        <button
          onClick={stop}
          style={{ background: "none", border: "1px solid var(--border, rgba(255,255,255,0.1))", color: "var(--text-muted)", padding: "4px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "0.8rem" }}
        >
          Stop
        </button>
      )}

      <div style={{ minHeight: "60px", textAlign: "center", width: "100%" }}>
        <AnimatePresence mode="wait">
          {isRecording && (
            <motion.p key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ color: "var(--critical, #e11d48)", fontSize: "0.9rem", fontWeight: 600 }}>
              🎙️ Listening...
            </motion.p>
          )}
          {isProcessing && (
            <motion.p key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Processing audio...
            </motion.p>
          )}
          {thinking && (
            <motion.p key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ color: "var(--teal)", fontSize: "0.9rem" }}>
              Reasoning...
            </motion.p>
          )}
          {transcript && !isBusy && (
            <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "0.5rem" }}>
                &quot;{transcript}&quot;
              </p>
              {aiResponse && (
                <p style={{ fontSize: "1.05rem", fontWeight: 500 }}>{aiResponse}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", opacity: 0.7 }}>
        Hold to speak. Powered by Sarvam AI &amp; ElevenLabs.
      </p>
    </div>
  );
}
