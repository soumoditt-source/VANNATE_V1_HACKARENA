import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Server, Key, Brain, FileText, Database, Code } from "lucide-react";

export const metadata: Metadata = {
  title: "API Strategy & Architecture | Vannate",
  description: "Learn about the serverless, keyless integrations powering Vannate's AI Humanitarian OS.",
};

export default function InfoPage() {
  return (
    <div style={{ minHeight: "100vh", padding: "120px 20px 40px", background: "var(--bg-main)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Link href="/" className="btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "40px", padding: "8px 16px" }}>
          <ArrowLeft size={16} /> Back to Hub
        </Link>
        
        <div style={{ marginBottom: "60px" }}>
          <div className="section-kicker">System Architecture</div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--text)", marginBottom: "20px", lineHeight: "1.2" }}>
            The API Strategy Powering <span style={{ color: "var(--teal)" }}>Vannate OS</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: "1.8" }}>
            Vannate utilizes a unique blend of serverless architecture, edge AI, and keyless bridging to ensure that the platform remains universally accessible, infinitely scalable, and cost-efficient for NGOs worldwide.
          </p>
        </div>

        <div style={{ display: "grid", gap: "32px" }}>
          {/* Puter.js Section */}
          <div className="card" style={{ padding: "32px", border: "1px solid var(--border)", background: "var(--surface)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(20,184,166,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--teal)" }}>
                <Server size={24} />
              </div>
              <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Puter.js Integration</h2>
            </div>
            <h3 style={{ fontSize: "1.1rem", color: "var(--text-muted)", marginBottom: "16px" }}>The Best Free Cloud API Strategy</h3>
            <p style={{ lineHeight: "1.7", color: "var(--text-muted)" }}>
              Puter.js is a serverless, keyless framework that utilizes a &quot;User-Pays&quot; model. Instead of the core platform paying for API token volumes, the tool acts as a zero-cost bridge where end-users manage their own resource allocations directly through the client browser. This enables Vannate to scale globally without massive centralized infrastructure costs.
            </p>
          </div>

          {/* OCR.space Section */}
          <div className="card" style={{ padding: "32px", border: "1px solid var(--border)", background: "var(--surface)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}>
                <FileText size={24} />
              </div>
              <h2 style={{ fontSize: "1.5rem", margin: 0 }}>OCR.space Processing</h2>
            </div>
            <h3 style={{ fontSize: "1.1rem", color: "var(--text-muted)", marginBottom: "16px" }}>Instant Document Digitization</h3>
            <p style={{ lineHeight: "1.7", color: "var(--text-muted)" }}>
              Vannate integrates OCR.space to power our NGO CRM and beneficiary verification modules. When ground volunteers upload physical prescription slips, hospital blood requests, or relief receipts, the OCR engine instantly digitizes the data to log it cryptographically into the trust system.
            </p>
          </div>

          {/* AI Integrations Section */}
          <div className="card" style={{ padding: "32px", border: "1px solid var(--border)", background: "var(--surface)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f97316" }}>
                <Brain size={24} />
              </div>
              <h2 style={{ fontSize: "1.5rem", margin: 0 }}>Advanced AI Suite</h2>
            </div>
            <p style={{ lineHeight: "1.7", color: "var(--text-muted)" }}>
              Our platform relies on a sophisticated mix of AI providers to ensure maximum capability:
            </p>
            <ul style={{ marginTop: "16px", paddingLeft: "20px", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "12px" }}>
              <li><strong>Mistral & Groq:</strong> Powering our ultra-fast reasoning engine for crisis response and demand prediction.</li>
              <li><strong>ElevenLabs:</strong> Providing highly emotive, multi-lingual TTS (Text-to-Speech) for our voice assistant to ensure human-like empathy.</li>
              <li><strong>TensorFlow.js:</strong> Running client-side neural networks for instant spatial analysis on our interactive crisis maps.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
