"use client";
import { useState } from "react";
import LiveMap from "@/components/live/LiveMap";
import { liveApiCatalog } from "@/lib/live";

const alerts = [
  { id: "ALT-001", type: "Flood", zone: "Howrah Sector 4", severity: "critical", time: "10 min ago", affected: 1240 },
  { id: "ALT-002", type: "Power Outage", zone: "Salt Lake Block C", severity: "high", time: "34 min ago", affected: 420 },
  { id: "ALT-003", type: "Medical Surge", zone: "Behala Hospital", severity: "high", time: "1 hr ago", affected: 86 },
];

const resources = [
  { label: "Drinking Water", value: 8000, unit: "L", priority: "P1", fill: 22 },
  { label: "Medical Teams", value: 4, unit: "teams", priority: "P1", fill: 40 },
  { label: "Food Kits", value: 1240, unit: "kits", priority: "P2", fill: 58 },
  { label: "Tarpaulin Sheets", value: 600, unit: "sheets", priority: "P2", fill: 35 },
  { label: "Volunteers Needed", value: 50, unit: "people", priority: "P3", fill: 62 },
];

const forecasts = [
  { warn: "Insulin supply critical by 6PM", level: "critical" },
  { warn: "Doctor shortage if no dispatch within 2hrs", level: "high" },
  { warn: "Food kits adequate for next 8 hours", level: "medium" },
];

export default function CrisisPage() {
  const [active, setActive] = useState(0);
  const al = alerts[active];

  return (
    <div className="page-shell">
      <div className="page-hero" style={{ background: "linear-gradient(180deg,rgba(239,68,68,0.08),transparent)" }}>
        <div className="page-hero-inner">
          <div className="section-kicker" style={{ color: "var(--red)" }}>Emergency Command Center</div>
          <h1>Crisis Response Intelligence</h1>
          <p>Real-time heatmaps, resource dispatch, volunteer routing, and 24-hour shortage forecasting — activated the moment disaster strikes.</p>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button className="btn-danger">Declare Emergency</button>
            <button className="btn-ghost">Broadcast Alert</button>
            <button className="btn-ghost">Dispatch Team</button>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
            {alerts.map((a, i) => (
              <div
                key={a.id}
                className="card card-sm"
                style={{ cursor: "pointer", borderColor: i === active ? "rgba(239,68,68,0.5)" : undefined, background: i === active ? "rgba(239,68,68,0.07)" : undefined }}
                onClick={() => setActive(i)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{a.type}</span>
                  <div className={`badge badge-${a.severity === "critical" ? "critical" : "high"}`}>{a.severity}</div>
                </div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{a.zone}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{a.affected.toLocaleString()} affected &middot; {a.time}</div>
              </div>
            ))}
          </div>

          <div className="responsive-two-col" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 20 }}>
            <div className="panel">
              <div className="panel-head">
                <h3>Crisis Heatmap &mdash; {al.zone}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "999px", background: "var(--red)", display: "inline-block", animation: "blink 1.2s ease-in-out infinite" }} />
                  <span style={{ fontSize: "0.82rem", color: "var(--red)" }}>LIVE</span>
                </div>
              </div>
              <div className="panel-body">
                <div className="route-map" style={{ minHeight: 320 }}>
                  <div className="map-grid" />
                  <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "999px", background: "rgba(239,68,68,0.35)", filter: "blur(28px)", top: "20%", left: "30%" }} />
                  <div style={{ position: "absolute", width: 90, height: 90, borderRadius: "999px", background: "rgba(245,158,11,0.3)", filter: "blur(20px)", top: "45%", right: "25%" }} />
                  <div style={{ position: "absolute", width: 70, height: 70, borderRadius: "999px", background: "rgba(239,68,68,0.2)", filter: "blur(16px)", bottom: "20%", left: "15%" }} />
                  <svg viewBox="0 0 600 320" preserveAspectRatio="none">
                    <path className="river" d="M0,200 Q150,180 300,200 Q450,220 600,200" />
                    <line x1="180" y1="80" x2="300" y2="160" stroke="var(--gold)" strokeWidth="2" strokeDasharray="8 6" />
                    <circle cx="180" cy="80" r="10" className="map-pulse hub" />
                    <circle cx="300" cy="160" r="14" className="map-pulse live" />
                    <circle cx="450" cy="240" r="10" className="map-pulse dest" />
                    <text x="188" y="74" className="map-label">Relief Hub</text>
                    <text x="310" y="154" className="map-label" fill="#fca5a5">Crisis Zone</text>
                    <text x="460" y="234" className="map-label">Shelter</text>
                  </svg>
                  <div className="map-stat-box">
                    <span>Affected</span>
                    <strong style={{ color: "var(--red)" }}>{al.affected.toLocaleString()}</strong>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 16 }}>
                  {[["Response Teams","7 dispatched"],["ETA","18 minutes"],["Volunteers En Route","14"]].map(([k, v]) => (
                    <div key={k} className="metric-card">
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{k}</div>
                      <div style={{ fontWeight: 700, marginTop: 6, color: "var(--gold)" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
              <div className="panel">
                <div className="panel-head"><h3>Critical Needs</h3><span className="badge badge-critical">P1 Priority</span></div>
                <div className="panel-body" style={{ display: "grid", gap: 16 }}>
                  {resources.map((r) => (
                    <div key={r.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.88rem" }}>
                        <span style={{ fontWeight: 600 }}>{r.label}</span>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontWeight: 700, color: r.fill < 40 ? "var(--red)" : "var(--gold)" }}>{r.value} {r.unit}</span>
                          <div className={`badge ${r.priority === "P1" ? "badge-critical" : r.priority === "P2" ? "badge-high" : "badge-medium"}`}>{r.priority}</div>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div className={`progress-fill ${r.fill < 40 ? "red" : ""}`} style={{ width: `${r.fill}%` }} />
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>{r.fill}% fulfilled</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-head"><h3>AI Forecast (24h)</h3></div>
                <div className="panel-body" style={{ display: "grid", gap: 10 }}>
                  {forecasts.map((f) => (
                    <div key={f.warn} className={`badge badge-${f.level}`} style={{ borderRadius: "var(--radius-sm)", padding: "10px 14px", display: "block", fontSize: "0.85rem", whiteSpace: "normal", lineHeight: 1.5 }}>
                      {f.warn}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <LiveMap title="Incident Response Live Map" layer="incident" />
          </div>

          <div className="panel" style={{ marginTop: 20 }}>
            <div className="panel-head">
              <h3>Live Incident Response APIs</h3>
              <span className="badge badge-critical">connectable</span>
            </div>
            <div className="panel-body api-ready-grid">
              {liveApiCatalog
                .filter((api) => ["Free live map tiles", "Production routing and distance matrix", "Geocoding and reverse geocoding", "Push notifications", "Audio transcription", "MP4 incident analysis"].includes(api.need))
                .map((api) => (
                  <div key={api.need} className="api-ready-item">
                    <strong>{api.need}</strong>
                    <span>{api.freeOption}</span>
                    <code>{api.env}</code>
                    <p>{api.reason}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
