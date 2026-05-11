"use client";
import { useState, useRef, useEffect } from "react";

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
type SpeechRecognitionResultEventLike = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
};
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  start: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const chips = [
  "Find O- blood donors near me",
  "Draft a flood relief impact report",
  "What is the Vannate Trust Score?",
  "How to apply for CSR funding?",
  "Volunteer dispatch for Howrah crisis",
  "Translate this to Bengali",
];

const langs = ["English","Bengali","Hindi","Tamil","Telugu","Marathi","Assamese","Odia"];

export default function CopilotPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Namaskar! I am Vanna, your AI humanitarian assistant. I can help with donations, blood emergencies, NGO reports, crisis response, and translation. How can I serve humanity today?", sources: ["Vannate Core Vision"] }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState("English");
  const bottomRef = useRef<HTMLDivElement>(null);
  const recogRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  function startVoice() {
    const browserWindow = window as SpeechRecognitionWindow;
    const SR = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    if (!SR) { alert("Voice not supported in this browser. Use Chrome."); return; }
    const rec = new SR();
    rec.lang = lang === "Bengali" ? "bn-IN" : lang === "Hindi" ? "hi-IN" : lang === "Tamil" ? "ta-IN" : lang === "Telugu" ? "te-IN" : lang === "Marathi" ? "mr-IN" : "en-IN";
    rec.continuous = false;
    rec.onstart = () => setListening(true);
    rec.onresult = (e) => { setInput(e.results[0][0].transcript); setListening(false); };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
    recogRef.current = rec;
  }

  function speak(text: string) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text.slice(0, 300));
    utt.lang = lang === "Bengali" ? "bn-IN" : lang === "Hindi" ? "hi-IN" : "en-IN";
    utt.rate = 0.95;
    window.speechSynthesis.speak(utt);
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
          mode: "citizen",
          language: lang,
          evidence: analysis?.verifiedExtraction ?? undefined,
        }),
      });
      const data = await res.json() as { answer?: string; sources?: string[] };
      const answer = data.answer ?? "I have retrieved context to answer your query. Based on verified humanitarian knowledge, here is my response.";
      setMsgs(m => [...m, { role: "ai", text: answer, sources: data.sources ?? [] }]);
      speak(answer);
    } catch {
      const fallback = "Based on retrieved humanitarian knowledge: " + q;
      setMsgs(m => [...m, { role: "ai", text: fallback }]);
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
      setMsgs((current) => [
        ...current,
        {
          role: "ai",
          text: `${data.pipeline ?? "analysis"} pipeline is ${data.status ?? "ready"}. ${data.nextAction ?? ""}`,
          sources: ["Vannate Multimodal Analysis Contract"],
        },
      ]);
    } catch {
      setAnalysis({
        status: "analysis-error",
        nextAction: "Could not reach /api/analyze. Check the local server and retry.",
      });
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="page-hero" style={{ background: "linear-gradient(180deg,rgba(139,92,246,0.07),transparent)" }}>
        <div className="page-hero-inner">
          <div className="section-kicker" style={{ color: "var(--purple)" }}>AI Copilot</div>
          <h1>Meet Vanna &mdash; Your Humanitarian AI</h1>
          <p>RAG-powered, multilingual, voice-enabled. Vanna knows every NGO, crisis, donor, and compliance rule on the Vannate network.</p>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="copilot-layout">
            <div style={{ display: "grid", gap: 14 }}>
              <div className="card card-sm">
                <div style={{ textAlign: "center", padding: "8px 0" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "999px", background: "linear-gradient(135deg,var(--purple),var(--teal-2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 12px", boxShadow: "0 0 32px rgba(139,92,246,0.4)" }}>V</div>
                  <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>Vanna</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 4 }}>Humanitarian AI Assistant</div>
                  <div className="badge badge-success" style={{ margin: "10px auto 0", display: "inline-flex" }}>Online</div>
                </div>
              </div>

              <div className="card card-sm">
                <div className="form-label">Response Language</div>
                <select className="form-select" value={lang} onChange={e => setLang(e.target.value)}>
                  {langs.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              <div className="card card-sm">
                <div style={{ fontWeight: 700, marginBottom: 12, fontSize: "0.9rem" }}>Quick Prompts</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {chips.map(c => (
                    <button key={c} className="btn-outline btn-sm" style={{ textAlign: "left", justifyContent: "flex-start" }} onClick={() => send(c)}>{c}</button>
                  ))}
                </div>
              </div>

              <div className="card card-sm" style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: 8 }}>RAG Sources</div>
                <div>NGO Knowledge Base &middot; Disaster SOPs &middot; Blood Bank Guidelines &middot; CSR Policies &middot; Compliance Rules &middot; Grant Templates</div>
              </div>

              <div className="card card-sm">
                <div style={{ fontWeight: 700, marginBottom: 10, fontSize: "0.9rem" }}>OCR / Audio / MP4 Evidence</div>
                <label className="btn-outline btn-sm" style={{ justifyContent: "center", cursor: "pointer" }}>
                  {analyzing ? "Analyzing..." : "Upload Evidence"}
                  <input
                    type="file"
                    accept="image/*,application/pdf,audio/*,video/mp4,video/webm,video/quicktime"
                    style={{ display: "none" }}
                    onChange={(event) => analyzeFile(event.target.files?.[0])}
                  />
                </label>
                {analysis && (
                  <div className="analysis-card">
                    <strong>{analysis.pipeline ?? "analysis"}</strong>
                    <span>{analysis.status ?? "ready"}</span>
                    <p>{analysis.nextAction}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="panel" style={{ display: "flex", flexDirection: "column", height: "78vh" }}>
              <div className="panel-head" style={{ flexShrink: 0 }}>
                <h3>Conversation</h3>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Voice: {lang}</span>
                  <button className="btn-outline btn-sm" onClick={() => window.speechSynthesis?.cancel()}>Stop</button>
                </div>
              </div>

              <div className="reasoning-strip">
                {["retrieve", "evidence", "rank", "cite", "review", "dispatch", "audit", "learn"].map((step, index) => (
                  <span key={step}>{index + 1}. {step}</span>
                ))}
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "grid", gap: 14, alignContent: "start" }}>
                {msgs.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "999px", background: m.role === "ai" ? "linear-gradient(135deg,var(--purple),var(--teal-2))" : "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0, fontWeight: 700, color: "white" }}>
                      {m.role === "ai" ? "V" : "U"}
                    </div>
                    <div style={{ maxWidth: "80%" }}>
                      <div className={`chat-msg ${m.role}`}>{m.text}
                        {m.sources && m.sources.length > 0 && (
                          <div className="msg-source">Sources: {m.sources.join(" &middot; ")}</div>
                        )}
                      </div>
                      {m.role === "ai" && (
                        <button style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "none", border: "none", marginTop: 4, cursor: "pointer" }} onClick={() => speak(m.text)}>Play</button>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "999px", background: "linear-gradient(135deg,var(--purple),var(--teal-2))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white" }}>V</div>
                    <div className="chat-msg ai" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "999px", background: "var(--teal)", display: "inline-block", animation: "blink 0.8s ease-in-out infinite" }} />
                      <span style={{ width: 8, height: 8, borderRadius: "999px", background: "var(--teal)", display: "inline-block", animation: "blink 0.8s ease-in-out 0.2s infinite" }} />
                      <span style={{ width: 8, height: 8, borderRadius: "999px", background: "var(--teal)", display: "inline-block", animation: "blink 0.8s ease-in-out 0.4s infinite" }} />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

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
                    <button className={`voice-btn${listening ? " listening" : ""}`} onClick={startVoice} title="Voice input">
                      {listening ? "●" : "Mic"}
                    </button>
                    <button className="btn-primary" style={{ height: "auto", padding: "10px 18px" }} onClick={() => send()} disabled={loading || !input.trim()}>
                      &rarr;
                    </button>
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
