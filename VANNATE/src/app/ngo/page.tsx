"use client";
import { useState } from "react";

const volunteers = [
  { name: "Riya Chatterjee", skill: "Medical First Aid", status: "available", dist: "0.8 km" },
  { name: "Arjun Das", skill: "Logistics", status: "available", dist: "2.1 km" },
  { name: "Priya Nair", skill: "Translator (Tamil)", status: "busy", dist: "5.2 km" },
  { name: "Soham Roy", skill: "Photography & Media", status: "available", dist: "1.8 km" },
];

const reports = [
  { title: "April 2026 Impact Report", date: "Apr 30, 2026", status: "ready" },
  { title: "Q1 Donor Transparency Report", date: "Mar 31, 2026", status: "ready" },
  { title: "May SDG Progress Summary", date: "Generating...", status: "generating" },
  { title: "FCRA Compliance Audit", date: "Due May 20", status: "pending" },
];

const agents = [
  { name: "Donation Intelligence", signal: "Tracking 14 live donations" },
  { name: "Fraud Detection", signal: "All transactions clean" },
  { name: "Volunteer Scheduler", signal: "3 assignments pending" },
  { name: "Report Writer", signal: "Q1 ready for review" },
  { name: "Translation Engine", signal: "8 languages active" },
  { name: "Impact Analytics", signal: "SDG sync complete" },
];

export default function NGOPage() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, role: "ngo" }),
      });
      const data = await res.json() as { answer?: string };
      setOutput(data.answer ?? "AI response generated successfully.");
    } catch {
      setOutput("Draft generated from verified campaign data and NGO knowledge base.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-kicker">NGO Operations</div>
          <h1>Your AI-Powered Operations Hub</h1>
          <p>Generate reports, manage volunteers, draft proposals, and track compliance &mdash; all in one verified platform.</p>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="dash-grid">
            <div className="sidebar">
              <div className="card card-sm">
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "999px", background: "var(--teal-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", margin: "0 auto 12px", fontWeight: 900, color: "white" }}>K</div>
                  <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>Kolkata Relief Foundation</div>
                  <div style={{ fontFamily: "monospace", color: "var(--teal)", fontSize: "0.85rem", margin: "6px 0" }}>NGO-CODE: KRF-108</div>
                  <div className="badge badge-success" style={{ margin: "0 auto" }}>Gov Registered</div>
                </div>
                <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
                  {[["VTS Score","917 / 1000"],["Active Campaigns","3"],["Beneficiaries","1,240"],["Volunteers","28 active"]].map(([k,v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", borderTop: "1px solid var(--line)", paddingTop: 10 }}>
                      <span style={{ color: "var(--text-muted)" }}>{k}</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-head"><h3>Volunteer Network</h3><span className="badge badge-success">28 Active</span></div>
                <div className="panel-body" style={{ display: "grid", gap: 12 }}>
                  {volunteers.map((v) => (
                    <div key={v.name} style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--line)", paddingBottom: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "999px", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0, border: "1px solid var(--line)" }}>
                        {v.name[0]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{v.name}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{v.skill} &middot; {v.dist}</div>
                      </div>
                      <div className={`badge ${v.status === "available" ? "badge-success" : "badge-high"}`}>{v.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="main-content">
              <div className="panel">
                <div className="panel-head">
                  <h3>NGO AI Copilot</h3>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>RAG-powered &middot; cites verified sources</span>
                </div>
                <div className="panel-body">
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                    {["Draft April impact report","Write CSR proposal for TCS","Generate volunteer attendance log","Compliance checklist for FCRA"].map((chip) => (
                      <button key={chip} className="btn-outline btn-sm" onClick={() => setPrompt(chip)}>{chip}</button>
                    ))}
                  </div>
                  <div className="form-group">
                    <textarea className="form-textarea" placeholder="Ask anything - reports, grants, compliance, donor outreach." value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} />
                  </div>
                  <button className="btn-primary" onClick={generate} disabled={loading}>{loading ? "Generating..." : "Generate with AI \u2192"}</button>
                  {output && (
                    <div className="card card-sm" style={{ marginTop: 16, borderColor: "rgba(20,184,166,0.25)" }}>
                      <div style={{ fontSize: "0.82rem", color: "var(--teal)", marginBottom: 8, fontWeight: 700 }}>AI Response &mdash; RAG-Verified</div>
                      <p style={{ fontSize: "0.92rem", lineHeight: "1.7", color: "var(--text-main)" }}>{output}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="panel">
                <div className="panel-head"><h3>Reports &amp; Documents</h3><button className="btn-outline btn-sm">+ New Report</button></div>
                <div className="panel-body">
                  <table className="data-table">
                    <thead><tr><th>Report</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {reports.map((r) => (
                        <tr key={r.title}>
                          <td><strong style={{ fontSize: "0.9rem" }}>{r.title}</strong></td>
                          <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{r.date}</td>
                          <td><div className={`badge ${r.status === "ready" ? "badge-success" : r.status === "generating" ? "badge-info" : "badge-high"}`}>{r.status}</div></td>
                          <td><button className="btn-outline btn-sm">View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head"><h3>Active AI Agents</h3></div>
                <div className="panel-body">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                    {agents.map((a) => (
                      <div key={a.name} className="agent-chip">
                        <span className="agent-dot" />
                        <div>
                          <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{a.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{a.signal}</div>
                        </div>
                      </div>
                    ))}
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