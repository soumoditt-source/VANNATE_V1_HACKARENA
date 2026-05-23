"use client";

import { useState } from "react";
import DynamicMap from "@/components/ui/DynamicMap";

export default function TrustEnginePage() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 0, title: "Beneficiary Registration", desc: "Enroll with valid Govt ID (Aadhaar, Voter ID)", color: "#14b8a6" },
    { id: 1, title: "Document Verification", desc: "Computer Vision + AI checks document authenticity", color: "#3b82f6" },
    { id: 2, title: "Kiosk / Volunteer QR Scan", desc: "On-field verification by Vannate volunteers", color: "#f59e0b" },
    { id: 3, title: "NITI Aayog Level Validation", desc: "Unique ID generation & Trust Score assignment", color: "#8b5cf6" },
    { id: 4, title: "Funding Status Updated", desc: "Eligibility confirmed & ready to receive donations", color: "#22c55e" }
  ];

  return (
    <div className="page-shell">
      <div className="page-hero" style={{ background: "linear-gradient(180deg,rgba(20,184,166,0.08),transparent)" }}>
        <div className="page-hero-inner">
          <div className="section-kicker" style={{ color: "var(--teal)" }}>Vannate Trust Engine</div>
          <h1>Verification & Trust Score Engine</h1>
          <p>End-to-end beneficiary verification with Govt ID checks, computer vision document analysis, and live QR-based field validation.</p>
        </div>
      </div>

      <div className="section">
        <div className="section-inner">
          <div className="panel" style={{ marginBottom: 28 }}>
            <div className="panel-head">
              <h3>Verification Pipeline</h3>
              <span className="badge badge-success">AI-Powered</span>
            </div>
            <div className="panel-body" style={{ paddingTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", marginBottom: 40 }}>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 3, background: "var(--surface-2)", zIndex: 0 }} />
                {steps.map((step, idx) => (
                  <div key={step.id} style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: idx <= activeStep ? step.color : "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 800, color: "#fff", boxShadow: idx === activeStep ? `0 0 30px ${step.color}66` : "none", margin: "0 auto 12px", cursor: "pointer" }} onClick={() => setActiveStep(idx)}>
                      {idx + 1}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{step.title}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ background: "var(--surface-2)", borderColor: steps[activeStep].color + "44" }}>
                <h3 style={{ marginBottom: 8, color: steps[activeStep].color }}>{steps[activeStep].title}</h3>
                <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>{steps[activeStep].desc}</p>
                {activeStep === 1 && (
                  <div style={{ background: "#14b8a611", border: "1px solid #14b8a644", borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: "2rem" }}>🔍</div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#14b8a6" }}>Computer Vision Active</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Document tampering detection, hologram verification, OCR text extraction</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="responsive-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20 }}>
            <div>
              <div className="panel">
                <div className="panel-head">
                  <h3>Beneficiary Registration Form</h3>
                  <span className="badge badge-info">Kiosk Mode</span>
                </div>
                <div className="panel-body">
                  <div style={{ display: "grid", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 6 }}>Full Name</label>
                      <input type="text" className="form-input" placeholder="Enter beneficiary full name" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 6 }}>Govt ID Type</label>
                        <select className="form-select">
                          <option>Aadhaar Card</option>
                          <option>Voter ID</option>
                          <option>PAN Card</option>
                          <option>Ration Card</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 6 }}>ID Number</label>
                        <input type="text" className="form-input" placeholder="XXXX XXXX XXXX" />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 6 }}>Medical Document Upload (for blood/medical need)</label>
                      <input type="file" className="form-input" accept="image/*,.pdf" />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 6 }}>Address (Location)</label>
                      <input type="text" className="form-input" placeholder="Enter full address" />
                    </div>
                    <button className="btn-primary" style={{ marginTop: 8 }}>Submit for Verification</button>
                  </div>
                </div>
              </div>

              <div className="card" style={{ marginTop: 20, borderColor: "rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.05)" }}>
                <h3 style={{ marginBottom: 8, color: "var(--purple)" }}>Trust Score Preview</h3>
                <div style={{ fontSize: "2.8rem", fontWeight: 900, color: "var(--purple)" }}>94/100</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>Based on document validity, location verification, and past history</div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <h3>Live Verification Map</h3>
                <span className="badge badge-teal">GPS Locked</span>
              </div>
              <div className="panel-body" style={{ padding: 0 }}>
                <div style={{ height: 450, borderRadius: "0 0 16px 16px", overflow: "hidden" }}>
                  <DynamicMap />
                </div>
              </div>
            </div>
          </div>

          <div className="panel" style={{ marginTop: 28 }}>
            <div className="panel-head">
              <h3>Verification Checkpoints</h3>
            </div>
            <div className="panel-body" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[
                { icon: "🪪", title: "Govt ID Validated", desc: "Aadhaar/Voter ID authenticity confirmed" },
                { icon: "📷", title: "Computer Vision", desc: "Document hologram & tamper check passed" },
                { icon: "📍", title: "Geo-Verified", desc: "Beneficiary location GPS confirmed" },
                { icon: "🤝", title: "Volunteer Verified", desc: "On-field kiosk QR scan completed" },
                { icon: "🏛️", title: "NITI Aayog Level", desc: "Unique Trust ID generated" },
                { icon: "✅", title: "Eligibility Confirmed", desc: "Ready to receive donations" }
              ].map((item, i) => (
                <div key={i} className="card card-sm" style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ fontSize: "1.8rem" }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.title}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
