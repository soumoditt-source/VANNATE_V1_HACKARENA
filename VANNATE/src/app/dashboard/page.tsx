"use client";
import { useState } from "react";
import { campaigns, activeDonation } from "@/lib/data";
import { generateHumanitarianIds, generateUserIdentity } from "@/lib/id";
import QRCode from "react-qr-code";

export default function DashboardPage() {
  const [did] = useState(() => generateHumanitarianIds("108").donorId);
  const [identity] = useState(() => generateUserIdentity("citizen", "Demo Donor"));
  const [donating, setDonating] = useState(false);
  const [donated, setDonated] = useState<string | null>(null);
  const [amount, setAmount] = useState("500");

  async function handleDonate(campaignId: string) {
    setDonating(true);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorId: did, campaignId, amount: Number(amount), ngoCode: "108" }),
      });
      const data = await res.json() as { donation?: { id: string } };
      setDonated(data.donation?.id ?? "VN-DEMO-OFFLINE");
    } catch {
      setDonated("VN-DEMO-OFFLINE");
    } finally {
      setDonating(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="page-hero-inner dashboard-hero-inner">
          <div className="dashboard-hero-copy">
            <div className="section-kicker">Donor Dashboard</div>
            <h1>Your Impact, Tracked Live</h1>
            <p>Every donation you make is verified, routed, and confirmed with QR-backed proof. Your trust score grows with each impact.</p>
          </div>
          <div className="card" style={{ padding: 16, background: "white", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
             <QRCode value={identity.qrPayload} size={110} bgColor="#ffffff" fgColor="#000000" level="Q" />
             <span style={{ fontSize: "0.7rem", fontFamily: "monospace", color: "#666", marginTop: 8 }}>{identity.accountId}</span>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          {donated && (
            <div className="card" style={{ marginBottom: 20, borderColor: "rgba(20,184,166,0.4)", background: "rgba(20,184,166,0.06)" }}>
              <strong style={{ color: "var(--teal)", display: "block", marginBottom: 6 }}>Donation Created Successfully</strong>
              <span style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>{donated}</span>
              <a href={`/track/${donated}`} className="btn-outline btn-sm" style={{ marginTop: 12, display: "inline-flex" }}>Track Donation &rarr;</a>
            </div>
          )}

          <div className="dash-grid">
            <div className="sidebar">
              <div className="card card-sm">
                <div style={{ fontWeight: 700, marginBottom: 16, color: "var(--teal)", fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your QR Identity</div>
                <div className="qr-box" style={{ margin: "0 auto 16px" }}>
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`qr-cell${[0,2,4,7,9,14,16,20,23,27,31,35,38,42,46,50,55,58,61].includes(i) ? " on" : ""}`} />
                  ))}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "1.1rem" }}>{did}</div>
                  <div style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 6 }}>{identity.accountId}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 6 }}>Kolkata Relief Foundation</div>
                  <div className="badge badge-teal" style={{ margin: "10px auto 0", display: "inline-flex" }}>Verified Donor</div>
                </div>
              </div>

              <div className="card card-sm">
                <div className="form-label">Donation Amount (Rs.)</div>
                <input className="form-input" type="number" value={amount} onChange={e => setAmount(e.target.value)} min="10" />
              </div>

              <div className="card card-sm">
                <div style={{ fontWeight: 700, marginBottom: 14, fontSize: "0.9rem" }}>Live Donation</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "var(--teal)", marginBottom: 12 }}>{activeDonation.id}</div>
                <div className="badge badge-info" style={{ marginBottom: 12 }}>In Transit</div>
                <div className="timeline">
                  {activeDonation.route.map((r) => (
                    <div key={r.label} className="timeline-item">
                      <div className={`tl-dot ${r.status === "complete" ? "done" : r.status === "current" ? "active" : "pending"}`} />
                      <div className="tl-content">
                        <strong>{r.label}</strong>
                        <span>{r.time} &middot; {r.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <a href={`/track/${activeDonation.id}`} className="btn-outline btn-sm" style={{ marginTop: 16, display: "block", textAlign: "center" }}>Full Route &rarr;</a>
              </div>
            </div>

            <div className="main-content">
              <div className="metric-row">
                <div className="metric-card">
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Total Donated</div>
                  <div className="metric-val" style={{ color: "var(--teal)" }}>Rs.14,200</div>
                  <div className="metric-lbl">across 6 campaigns</div>
                </div>
                <div className="metric-card">
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Lives Impacted</div>
                  <div className="metric-val" style={{ color: "var(--gold)" }}>38</div>
                  <div className="metric-lbl">beneficiaries confirmed</div>
                </div>
                <div className="metric-card">
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Trust Score</div>
                  <div className="metric-val" style={{ color: "var(--green)" }}>892</div>
                  <div className="metric-lbl">top 5% of donors</div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-head">
                  <h3>Verified Campaigns Near You</h3>
                  <span className="badge badge-teal">AI Matched</span>
                </div>
                <div className="panel-body" style={{ display: "grid", gap: 16 }}>
                  {campaigns.map((c) => (
                    <div key={c.id} className="campaign-item">
                      <div className="campaign-meta-row">
                        <div>
                          <div className="badge badge-teal" style={{ marginBottom: 6 }}>{c.category}</div>
                          <h4>{c.title}</h4>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div className={`badge badge-${c.urgency === "critical" ? "critical" : c.urgency === "high" ? "high" : "medium"}`}>{c.urgency.toUpperCase()}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 6 }}>VTS {c.trustScore}</div>
                        </div>
                      </div>
                      <p>{c.summary}</p>
                      <div className="progress-bar" style={{ marginBottom: 6 }}>
                        <div className="progress-fill" style={{ width: `${Math.round((c.raised / c.goal) * 100)}%` }} />
                      </div>
                      <div className="progress-label">
                        <span>Rs.{c.raised.toLocaleString("en-IN")} raised</span>
                        <span>Goal Rs.{c.goal.toLocaleString("en-IN")}</span>
                      </div>
                      <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                        <button className="btn-primary btn-sm" onClick={() => handleDonate(c.id)} disabled={donating}>
                          {donating ? "Processing..." : `Donate Rs.${amount}`}
                        </button>
                        <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{c.beneficiaries} beneficiaries &middot; {c.location}</span>
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
  );
}
