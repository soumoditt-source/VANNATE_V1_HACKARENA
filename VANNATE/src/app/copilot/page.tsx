"use client";
import { useState, useRef, useEffect } from "react";
import { useAITTS } from "@/lib/useAITTS";

type Msg = { role: "user" | "ai"; text: string; sources?: string[] };
type AnalysisResult = {
  file?: { name: string; type: string; size: number };
  pipeline?: string;
  status?: string;
  verifiedExtraction?: string | null;
  noHallucinationRule?: string;
  reasoning?: string[];
  providers?: { need: string; freeOption: string; env: string; reason: string }[];
  nextAction?: string;
};

const chips = [
  "Find O- blood donors near me",
  "Draft a flood relief impact report",
  "What is the Vannate Trust Score?",
  "How to apply for CSR funding?",
  "Volunteer dispatch for Howrah crisis",
  "Translate this to Bengali",
];

const langs = ["English", "Bengali", "Hindi", "Tamil", "Telugu", "Marathi", "Assamese", "Odia"];

const LANG_CODE: Record<string, string> = {
  Hindi: "hi", Bengali: "bn", Tamil: "ta",
  Telugu: "te", Marathi: "mr", Assamese: "as", Odia: "or", English: "en",
};

const SPEECH_LANG: Record<string, string> = {
  Hindi: "hi-IN", Bengali: "bn-IN", Tamil: "ta-IN",
  Telugu: "te-IN", Marathi: "mr-IN", English: "en-IN",
};

export default function CopilotPage() {
  const [mounted, setMounted] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: "Namaskar! I am Vanna, your AI humanitarian assistant. I can help with donations, blood emergencies, NGO reports, crisis response, and translation. How can I serve humanity today?",
      sources: ["Vannate Core Vision"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState("English");
  const [usePkl, setUsePkl] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recogRef = useRef<any>(null);
  const { speak, stop, isPlaying } = useAITTS();

  // Mount guard — prevents hydration mismatch from any client-only state
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  function startVoice() {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Voice not supported in this browser. Use Chrome or Edge."); return; }
    const rec = new SR();
    rec.lang = SPEECH_LANG[lang] || "en-IN";
    rec.continuous = false;
    rec.onstart = () => setListening(true);
    rec.onresult = (e: any) => { setInput(e.results[0][0].transcript); setListening(false); };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
    recogRef.current = rec;
  }

  async function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput("");
    setMsgs(m => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          role: "donor",
          mode: usePkl ? "custom-pkl-supervised" : "citizen",
          language: lang,
          evidence: analysis?.verifiedExtraction ?? undefined,
        }),
      });
      const data = await res.json() as { answer?: string; sources?: string[] };
      let finalAnswer = data.answer ?? "I am here to help you navigate this situation with care.";
      if (usePkl) finalAnswer = "[.pkl Inference — Supervised — L2 Reg Active] " + finalAnswer;
      setMsgs(m => [...m, { role: "ai", text: finalAnswer, sources: data.sources ?? [] }]);
      speak(finalAnswer, LANG_CODE[lang] || "en");
    } catch {
      const fallback = "I am listening. Could you please repeat that?";
      setMsgs(m => [...m, { role: "ai", text: fallback }]);
      speak(fallback, "en");
    } finally {
      setLoading(false);
    }
  }

  async function analyzeFile(file?: File) {
    if (!file) return;
    setAnalyzing(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await res.json() as AnalysisResult;
      setAnalysis(data);
      setMsgs(m => [...m, {
        role: "ai",
        text: `${data.pipeline ?? "analysis"} pipeline is ${data.status ?? "ready"}. ${data.nextAction ?? ""}`,
        sources: ["Vannate Multimodal Analysis"],
      }]);
    } catch {
      setAnalysis({ status: "error", nextAction: "Could not reach /api/analyze. Check the server." });
    } finally {
      setAnalyzing(false);
    }
  }

  // ── Skeleton while mounting ──────────────────────────────────────────────
  if (!mounted) {
    return (
      <div className="page-shell">
        <div className="page-hero" style={{ background: "linear-gradient(180deg,rgba(139,92,246,0.07),transparent)" }}>
          <div className="page-hero-inner">
            <div className="section-kicker" style={{ color: "var(--purple)" }}>AI Copilot</div>
            <h1>Meet Vanna — Your Humanitarian AI</h1>
            <p>RAG-powered, multilingual, voice-enabled.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-hero" style={{ background: "linear-gradient(180deg,rgba(139,92,246,0.07),transparent)" }}>
        <div className="page-hero-inner">
          <div className="section-kicker" style={{ color: "var(--purple)" }}>AI Copilot</div>
          <h1>Meet Vanna — Your Humanitarian AI</h1>
          <p>RAG-powered, multilingual, voice-enabled. Vanna knows every NGO, crisis, donor, and compliance rule on the Vannate network.</p>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="copilot-layout">
            {/* Sidebar */}
            <div style={{ display: "grid", gap: 14 }}>
              {/* Avatar */}
              <div className="card card-sm">
                <div style={{ textAlign: "center", padding: "8px 0" }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: "999px",
                    background: "linear-gradient(135deg,var(--purple),var(--teal-2))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "2rem", margin: "0 auto 12px",
                    boxShadow: "0 0 32px rgba(139,92,246,0.4)",
                  }}>V</div>
                  <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>Vanna</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 4 }}>Humanitarian AI Assistant</div>
                  <div className="badge badge-success" style={{ margin: "10px auto 0", display: "inline-flex" }}>Online</div>
                </div>
              </div>

              {/* Language + PKL toggle */}
              <div className="card card-sm">
                <div className="form-label">Response Language</div>
                <select className="form-select" value={lang} onChange={e => setLang(e.target.value)}>
                  {langs.map(l => <option key={l}>{l}</option>)}
                </select>
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
                  <label style={{
                    display: "flex", alignItems: "center", gap: 8,
                    fontSize: "0.85rem", cursor: "pointer",
                    color: usePkl ? "var(--teal)" : "var(--text-main)",
                  }}>
                    <input
                      type="checkbox"
                      checked={usePkl}
                      onChange={e => setUsePkl(e.target.checked)}
                    />
                    Enable .pkl Reasoning Engine
                  </label>
                  {usePkl && (
                    <div style={{ marginTop: 6, fontSize: "0.75rem", color: "var(--purple)", fontWeight: "bold" }}>
                      Overfit Prevention: Active (Dropout=0.3)
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Prompts */}
              <div className="card card-sm">
                <div style={{ fontWeight: 700, marginBottom: 12, fontSize: "0.9rem" }}>Quick Prompts</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {chips.map(c => (
                    <button key={c} className="btn-outline btn-sm"
                      style={{ textAlign: "left", justifyContent: "flex-start" }}
                      onClick={() => send(c)}>{c}</button>
                  ))}
                </div>
              </div>

              {/* RAG Sources */}
              <div className="card card-sm" style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: 8 }}>RAG Sources</div>
                <div>NGO Knowledge Base · Disaster SOPs · Blood Bank Guidelines · CSR Policies · Compliance Rules · Grant Templates</div>
              </div>

              {/* File Upload */}
              <div className="card card-sm">
                <div style={{ fontWeight: 700, marginBottom: 10, fontSize: "0.9rem" }}>OCR / Audio / MP4 Evidence</div>
                <label className="btn-outline btn-sm" style={{ justifyContent: "center", cursor: "pointer" }}>
                  {analyzing ? "Analyzing..." : "Upload Evidence"}
                  <input type="file"
                    accept="image/*,application/pdf,audio/*,video/mp4,video/webm,video/quicktime"
                    style={{ display: "none" }}
                    onChange={e => analyzeFile(e.target.files?.[0])} />
                </label>
                {analysis && (
                  <div className="analysis-card" style={{ marginTop: 10 }}>
                    <strong>{analysis.pipeline ?? "analysis"}</strong>
                    <span> — {analysis.status ?? "ready"}</span>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>{analysis.nextAction}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Panel */}
            <div className="panel" style={{ display: "flex", flexDirection: "column", height: "78vh" }}>
              <div className="panel-head" style={{ flexShrink: 0 }}>
                <h3>Conversation</h3>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Voice: {lang}</span>
                  {isPlaying && <span className="badge badge-success">Speaking...</span>}
                  <button className="btn-outline btn-sm" onClick={() => stop()}>Stop Voice</button>
                </div>
              </div>

              {/* Reasoning pipeline strip */}
              <div className="reasoning-strip">
                {["retrieve", "evidence", "rank", "cite", "review", "dispatch", "audit", "learn"].map((s, i) => (
                  <span key={s}>{i + 1}. {s}</span>
                ))}
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "grid", gap: 14, alignContent: "start" }}>
                {msgs.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "999px",
                      background: m.role === "ai" ? "linear-gradient(135deg,var(--purple),var(--teal-2))" : "var(--surface-2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.9rem", flexShrink: 0, fontWeight: 700, color: "white",
                    }}>
                      {m.role === "ai" ? "V" : "U"}
                    </div>
                    <div style={{ maxWidth: "80%" }}>
                      <div className={`chat-msg ${m.role}`}>{m.text}
                        {m.sources && m.sources.length > 0 && (
                          <div className="msg-source">Sources: {m.sources.join(" · ")}</div>
                        )}
                      </div>
                      {m.role === "ai" && (
                        <button
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            fontSize: "0.8rem", padding: "4px 12px", borderRadius: "16px",
                            background: "var(--teal-2)", color: "white", border: "none",
                            cursor: "pointer", fontWeight: 600, marginTop: 6,
                          }}
                          onClick={() => speak(m.text, LANG_CODE[lang] || "en")}
                        >🔊 Listen</button>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "999px",
                      background: "linear-gradient(135deg,var(--purple),var(--teal-2))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, color: "white",
                    }}>V</div>
                    <div className="chat-msg ai" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      {[0, 0.2, 0.4].map((d, i) => (
                        <span key={i} style={{
                          width: 8, height: 8, borderRadius: "999px", background: "var(--teal)",
                          display: "inline-block",
                          animation: `blink 0.8s ease-in-out ${d}s infinite`,
                        }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input Area */}
              <div style={{ padding: "16px 24px", borderTop: "1px solid var(--line)", flexShrink: 0 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: 60, flex: 1 }}
                    placeholder={`Ask Vanna anything in ${lang}...`}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button
                      className={`voice-btn${listening ? " listening" : ""}`}
                      onClick={startVoice} title="Voice input"
                    >{listening ? "●" : "🎤"}</button>
                    <button
                      className="btn-primary"
                      style={{ height: "auto", padding: "10px 18px" }}
                      onClick={() => send()}
                      disabled={loading || !input.trim()}
                    >→</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
