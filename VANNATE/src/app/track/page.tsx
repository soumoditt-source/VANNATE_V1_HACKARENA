"use client";

import { useState } from "react";
import DynamicMap from "@/components/ui/DynamicMap";

export default function LiveTrackingPage() {
  const [donationStep, setDonationStep] = useState(0);

  const steps = [
    { id: 0, title: "Donor Initiates", desc: "₹100 donated via UPI/Razorpay", color: "#3b82f6" },
    { id: 1, title: "Volunteer Receives", desc: "Live map shows volunteer pickup", color: "#14b8a6" },
    { id: 2, title: "NGO Hub", desc: "Donation reaches verified NGO center", color: "#f59e0b" },
    { id: 3, title: "Field Dispatch", desc: "Relief kit / funds en route to beneficiary", color: "#8b5cf6" },
    { id: 4, title: "Beneficiary Confirmed", desc: "QR scan confirms handoff with photo proof", color: "#22c55e" }
  ];

  return (
    <div className="page-shell">
      <div className="page-hero" style={{ background: "linear-gradient(180deg,rgba(59,130,246,0.08),transparent)" }}>
        <div className="page-hero-inner">
          <div className="section-kicker" style={{ color: "var(--blue)" }}>Live Donation Tracking</div>
          <h1>Every Rupee Tracked End-to-End</h1>
          <p>From donor scan to beneficiary handoff with live map steps, photo proof, and QR verification at every stage.</p>
        </div>
      </div>

      <div className="section">
        <div className="section-inner">
          <div className="panel" style={{ marginBottom: 28 }}>
            <div className="panel-head">
              <h3>Donation Flow (₹100 Example)</h3>
              <span className="badge badge-blue">Live</span>
            </div>
            <div className="panel-body" style={{ paddingTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", marginBottom: 40 }}>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 4, background: "var(--surface-2)", zIndex: 0 }} />
                {steps.map((step, idx) => (
                  <div key={step.id} style={{ position: "relative", zIndex: 1, textAlign: "center", cursor: "pointer" }} onClick={() => setDonationStep(idx)}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: idx <= donationStep ? step.color : "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", fontWeight: 900, color: "#fff", boxShadow: idx === donationStep ? `0 0 40px ${step.color}66` : "none", margin: "0 auto 12px", border: idx < donationStep ? "4px solid #fff" : "none" }}>
                      {idx === 0 ? "💳" : idx === 1 ? "🧑" : idx === 2 ? "🏛️" : idx === 3 ? "🚚" : "✅"}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>{step.title}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{ background: "var(--surface-2)", borderColor: steps[donationStep].color + "44" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                  <div>
                    <h3 style={{ color: steps[donationStep].color, marginBottom: 4 }}>{steps[donationStep].title}</h3>
                    <p style={{ color: "var(--text-muted)" }}>{steps[donationStep].desc}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--teal)" }}>₹100</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Donation Amount</div>
                  </div>
                </div>
                {donationStep === 4 && (
                  <div style={{ background: "#22c55e11", border: "1px solid #22c55e44", borderRadius: 12, padding: 16, marginTop: 12 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ fontSize: "2rem" }}>📸</div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#22c55e" }}>Photo Proof Uploaded</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Beneficiary confirmed receipt with QR scan & photo verification</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="responsive-two-col" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
            <div className="panel">
              <div className="panel-head">
                <h3>Live Route Map</h3>
                <span className="badge badge-blue">GPS Live</span>
              </div>
              <div className="panel-body" style={{ padding: 0 }}>
                <div style={{ height: 500, borderRadius: "0 0 16px 16px", overflow: "hidden" }}>
                  <DynamicMap />
                </div>
              </div>
            </div>

            <div>
              <div className="panel" style={{ marginBottom: 20 }}>
                <div className="panel-head">
                  <h3>Step Timeline</h3>
                </div>
                <div className="panel-body" style={{ display: "grid", gap: 12 }}>
                  {steps.map((step, idx) => (
                    <div key={step.id} className="card card-sm" style={{ background: idx === donationStep ? step.color + "11" : "var(--surface-2)", borderColor: idx <= donationStep ? step.color + "44" : "var(--border)", opacity: idx > donationStep ? 0.5 : 1 }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: step.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", color: "#fff", flexShrink: 0 }}>
                          {idx + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{step.title}</div>
                          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{step.desc}</div>
                          <div style={{ fontSize: "0.75rem", color: idx <= donationStep ? "#22c55e" : "var(--text-muted)", marginTop: 4 }}>
                            {idx < donationStep ? "✅ Completed" : idx === donationStep ? "🔄 In Progress" : "⏳ Pending"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ borderColor: "rgba(20,184,166,0.3)", background: "rgba(20,184,166,0.05)" }}>
                <h3 style={{ marginBottom: 8, color: "var(--teal)" }}>Donor Transparency</h3>
                <ul style={{ margin: 0, paddingLeft: 16, color: "var(--text-muted)", lineHeight: 1.8 }}>
                  <li>Every step timestamped & GPS-verified</li>
                  <li>QR scan required at each handoff</li>
                  <li>Photo proof uploaded for final delivery</li>
                  <li>Blockchain-inspired audit trail (demo)</li>
                  <li>Real-time trust score updates</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="panel" style={{ marginTop: 28 }}>
            <div className="panel-head">
              <h3>Demonstration Features for Hackathon</h3>
            </div>
            <div className="panel-body" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
              {[
                { icon: "🏛️", title: "NGO Verification", desc: "NITI Aayog/80G registration checks" },
                { icon: "🪪", title: "Beneficiary KYC", desc: "Govt ID + computer vision validation" },
                { icon: "📍", title: "Geo-Locked Steps", desc: "GPS boundary checks at each stage" },
                { icon: "📷", title: "Photo Proof", desc: "Upload & verify beneficiary handoff" },
                { icon: "🗺️", title: "Live Route Map", desc: "A* pathfinding with traffic/danger zones" },
                { icon: "🔗", title: "Audit Trail", desc: "Immutable log of every transaction step" }
              ].map((item, i) => (
                <div key={i} className="card card-sm">
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ fontSize: "2rem" }}>{item.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.title}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{item.desc}</div>
                    </div>
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
