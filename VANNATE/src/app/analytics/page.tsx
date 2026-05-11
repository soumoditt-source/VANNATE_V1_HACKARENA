"use client";
import { useEffect, useRef } from "react";

const kpis = [
  { label: "Lives Impacted", value: "1,24,381", change: "+12.4%", color: "teal", icon: "H" },
  { label: "Aid Disbursed", value: "Rs.8.4 Cr", change: "+18.2%", color: "gold", icon: "R" },
  { label: "Verified NGOs", value: "317", change: "+7 NGOs", color: "green", icon: "V" },
  { label: "Fraud Prevented", value: "Rs.24L", change: "14 cases", color: "red", icon: "S" },
  { label: "Volunteer Hours", value: "42,800", change: "+6.1%", color: "purple", icon: "P" },
  { label: "Delivery Rate", value: "99.2%", change: "+0.4%", color: "green", icon: "D" },
];

const sdgs = [
  { id: 1, label: "No Poverty", pct: 78 },
  { id: 2, label: "Zero Hunger", pct: 65 },
  { id: 3, label: "Good Health", pct: 82 },
  { id: 6, label: "Clean Water", pct: 71 },
  { id: 11, label: "Sustainable Cities", pct: 59 },
  { id: 17, label: "Partnerships", pct: 88 },
];

const topNGOs = [
  { name: "Kolkata Relief Foundation", code: "KRF-108", score: 917, aid: "Rs.2.1Cr", beneficiaries: 4200 },
  { name: "Aashroy Child Trust", code: "ACT-221", score: 884, aid: "Rs.87L", beneficiaries: 860 },
  { name: "City Blood Connect", code: "CBC-315", score: 932, aid: "N/A", beneficiaries: 1240 },
  { name: "Green Meals India", code: "GMI-442", score: 871, aid: "Rs.34L", beneficiaries: 6800 },
];

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const chartData = [42, 58, 71, 65, 88, 94, 108, 124, 138, 119, 142, 156];

function MiniBar({ pct, color }: { pct: number; color?: string }) {
  return (
    <div style={{ flex: 1 }}>
      <div className="progress-bar">
        <div className={`progress-fill${color ? ` ${color}` : ""}`} style={{ width: `${pct}%`, transition: "width 1s ease" }} />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const W = canvas.width, H = canvas.height;
    const maxY = Math.max(...chartData);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (H / 5) * i;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "rgba(20,184,166,0.35)");
    grad.addColorStop(1, "rgba(20,184,166,0)");
    ctx.beginPath();
    chartData.forEach((v, i) => {
      const x = (W / (chartData.length - 1)) * i;
      const y = H - (v / maxY) * H * 0.85 - 10;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath();
    chartData.forEach((v, i) => {
      const x = (W / (chartData.length - 1)) * i;
      const y = H - (v / maxY) * H * 0.85 - 10;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#14b8a6"; ctx.lineWidth = 2.5; ctx.stroke();
    chartData.forEach((v, i) => {
      const x = (W / (chartData.length - 1)) * i;
      const y = H - (v / maxY) * H * 0.85 - 10;
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#14b8a6"; ctx.fill();
    });
  }, []);

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-kicker">Impact Analytics</div>
          <h1>Measuring Humanity, Live</h1>
          <p>Every donation, volunteer hour, and delivery confirmation feeds real-time SDG-mapped impact metrics across the Vannate network.</p>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
            {kpis.map(k => (
              <div key={k.label} className="card card-sm" style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `rgba(var(--${k.color}-rgb, 20 184 166) / 0.15)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", fontWeight: 900, color: `var(--${k.color})`, flexShrink: 0 }}>{k.icon}</div>
                <div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 4 }}>{k.label}</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, fontFamily: "'Playfair Display',serif", color: `var(--${k.color})` }}>{k.value}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--green)", marginTop: 3 }}>{k.change} this month</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, marginBottom: 20 }}>
            <div className="panel">
              <div className="panel-head"><h3>Aid Disbursed (Rs. Lakhs) — 2026</h3><span className="badge badge-success">Live</span></div>
              <div className="panel-body">
                <canvas ref={canvasRef} style={{ width: "100%", height: 220, borderRadius: 8, display: "block" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: "0.73rem", color: "var(--text-muted)" }}>
                  {months.map(m => <span key={m}>{m}</span>)}
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-head"><h3>SDG Alignment</h3><span className="badge badge-teal">UN Mapped</span></div>
              <div className="panel-body" style={{ display: "grid", gap: 14 }}>
                {sdgs.map(s => (
                  <div key={s.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.85rem" }}>
                      <span><strong style={{ color: "var(--teal)" }}>SDG {s.id}</strong> — {s.label}</span>
                      <strong>{s.pct}%</strong>
                    </div>
                    <MiniBar pct={s.pct} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head"><h3>Top Verified NGOs by Trust Score</h3><span className="badge badge-teal">Live Ranked</span></div>
            <div className="panel-body">
              <table className="data-table">
                <thead><tr><th>Rank</th><th>NGO Name</th><th>Code</th><th>VTS Score</th><th>Aid Disbursed</th><th>Beneficiaries</th><th>Action</th></tr></thead>
                <tbody>
                  {topNGOs.map((n, i) => (
                    <tr key={n.code}>
                      <td><strong style={{ color: "var(--gold)" }}>#{i + 1}</strong></td>
                      <td><strong>{n.name}</strong></td>
                      <td><span style={{ fontFamily: "monospace", color: "var(--teal)", fontSize: "0.85rem" }}>{n.code}</span></td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="progress-bar" style={{ width: 60 }}><div className="progress-fill" style={{ width: `${n.score / 10}%` }} /></div>
                          <strong>{n.score}</strong>
                        </div>
                      </td>
                      <td>{n.aid}</td>
                      <td>{n.beneficiaries.toLocaleString()}</td>
                      <td><button className="btn-outline btn-sm">View &rarr;</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}