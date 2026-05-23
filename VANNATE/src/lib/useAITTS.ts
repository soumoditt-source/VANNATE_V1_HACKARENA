"use client";
import { useState, useCallback, useRef } from "react";

export function useAITTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const generationRef = useRef(0);

  const speak = useCallback(async (text: string, langCode: string = "en") => {
    generationRef.current += 1;
    const currentGeneration = generationRef.current;

    // Stop any existing playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(true);

    // Map standard 2-letter codes to Sarvam/Native specific dialect codes
    let target_language_code = `${langCode}-IN`;
    if (langCode === "en") target_language_code = "en-IN";

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          target_language_code,
          speaker: "ritu"
        })
      });

      if (!res.ok) throw new Error("TTS API failed");
      const data = await res.json();

      if (data.audios && data.audios.length > 0) {
        if (generationRef.current !== currentGeneration) return;
        const base64 = data.audios[0];
        // Sarvam returns WAV PCM; ElevenLabs returns MP3.
        // Detect by checking if the provider hint is in response, else use wav as default
        const mimeType = data.provider === "elevenlabs" ? "audio/mpeg" : "audio/wav";
        const audioSrc = `data:${mimeType};base64,${base64}`;
        const audio = new Audio(audioSrc);
        audioRef.current = audio;

        audio.onended = () => setIsPlaying(false);
        audio.onerror = (e) => {
          console.warn("Audio playback error, trying wav fallback:", e);
          // If wav fails, try mpeg as fallback
          if (mimeType === "audio/wav") {
            const alt = new Audio(`data:audio/mpeg;base64,${base64}`);
            alt.onended = () => setIsPlaying(false);
            alt.onerror = () => setIsPlaying(false);
            audioRef.current = alt;
            alt.play().catch(() => setIsPlaying(false));
          } else {
            setIsPlaying(false);
          }
        };

        await audio.play();
      } else {
        throw new Error("No audio returned");
      }
    } catch (err) {
      console.warn("Custom TTS API Failed. Falling back to native browser speech synthesis.", err);
      if (generationRef.current !== currentGeneration) return;

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = target_language_code;
        utterance.rate = 0.95;

        const voices = window.speechSynthesis.getVoices();

        // Priority sorting: 1. Exact match Premium/Google/Microsoft, 2. Exact match generic, 3. Base language match
        let bestVoice = voices.find(v => v.lang === target_language_code && (v.name.includes("Google") || v.name.includes("Microsoft")));
        if (!bestVoice) bestVoice = voices.find(v => v.lang === target_language_code);
        if (!bestVoice) bestVoice = voices.find(v => v.lang.startsWith(langCode));

        if (bestVoice) utterance.voice = bestVoice;

        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlaying(false);
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  }, []);

  return { speak, stop, isPlaying, voicesReady: true };
}
