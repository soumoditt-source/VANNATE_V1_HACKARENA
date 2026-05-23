"use client";
import { useState, useCallback, useRef } from "react";

export type MicError = "permission-denied" | "not-supported" | "network" | "unknown" | null;

export function useMic() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [micError, setMicError] = useState<MicError>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  const startRecording = useCallback(async () => {
    setIsProcessing(false);
    setMicError(null);

    // ── Primary: Native Browser Web Speech API ────────────────────────────
    // Works in Chrome, Edge, Safari 15+. Requires internet (Google STT backend).
    const hasNativeSR =
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);

    if (hasNativeSR) {
      try {
        const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SR();
        recognitionRef.current = recognition;

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.lang = "en-IN"; // Will be overridden by the component if needed

        recognition.onstart = () => {
          setIsRecording(true);
          setTranscript("");
        };

        recognition.onresult = (event: any) => {
          const result = event.results[0][0].transcript;
          setTranscript(result);
          setIsRecording(false);
        };

        recognition.onerror = (err: any) => {
          setIsRecording(false);
          setIsProcessing(false);
          if (err.error === "not-allowed" || err.error === "permission-denied") {
            setMicError("permission-denied");
          } else if (err.error === "network") {
            setMicError("network");
            // Fall through to MediaRecorder backend below
            tryMediaRecorderFallback();
          } else {
            setMicError("unknown");
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn("Native Speech Recognition failed, trying MediaRecorder fallback", e);
      }
    }

    // ── Fallback: MediaRecorder → /api/stt (Sarvam AI) ───────────────────
    await tryMediaRecorderFallback();
  }, []);

  async function tryMediaRecorderFallback() {
    try {
      // Check permission status first without throwing
      if (navigator.permissions) {
        try {
          const status = await navigator.permissions.query({ name: "microphone" as PermissionName });
          if (status.state === "denied") {
            setMicError("permission-denied");
            return;
          }
        } catch {
          // permissions API not supported in this browser, proceed anyway
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Find best supported mime type
      const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", ""].find(
        t => !t || MediaRecorder.isTypeSupported(t)
      ) ?? "";

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        setIsProcessing(true);
        const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
        const form = new FormData();
        form.append("file", blob, "recording.webm");
        try {
          const res = await fetch("/api/stt", { method: "POST", body: form });
          if (!res.ok) throw new Error(`STT API returned ${res.status}`);
          const data = await res.json();
          // Sarvam returns { transcript: "..." }
          if (data.transcript) {
            setTranscript(data.transcript);
          } else {
            throw new Error("Empty transcript from STT API");
          }
        } catch (err) {
          console.error("STT backend error:", err);
          setMicError("network");
        } finally {
          setIsProcessing(false);
          // Release all mic tracks
          stream.getTracks().forEach(t => t.stop());
        }
      };

      recorder.start();
      setIsRecording(true);
      setTranscript("");
    } catch (err: any) {
      console.error("Mic access error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setMicError("permission-denied");
      } else if (!navigator.mediaDevices) {
        setMicError("not-supported");
      } else {
        setMicError("unknown");
      }
      setIsRecording(false);
    }
  }

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* already stopped */ }
      setIsRecording(false);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      // Note: stream tracks are released in onstop handler above
      setIsRecording(false);
    }
  }, []);

  const clearError = useCallback(() => setMicError(null), []);

  return { isRecording, isProcessing, transcript, micError, clearError, startRecording, stopRecording };
}
