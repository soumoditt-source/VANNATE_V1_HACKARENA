import { activeDonation } from "@/lib/data";

export default async function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const donation = activeDonation;
  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-kicker">Live Donation Tracker</div>
          <h1>Your Aid Journey</h1>
          <p>Every step verified with geo-stamp, QR proof, and volunteer badge confirmation.</p>
        </div>
      </div>
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
            <div style={{ display: "grid", gap: 16 }}>
              <div className="card">
                <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 6 }}>DONATION ID</div>
                <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "1.05rem", color: "var(--teal)", wordBreak: "break-all", marginBottom: 16 }}>{id || donation.id}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                  {[["NGO", donation.ngo],["Category", donation.category],["Amount", `Rs.${donation.amount}`],["ETA", donation.eta],["Trust Token", donation.trustToken],["Impact", donation.impact]].map(([k,v]) => (
                    <div key={k} style={{ borderTop: "1px solid var(--line)", paddingTop: 10 }}>
                      <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{k}</div>
                      <div style={{ fontWeight: 600, fontSize: "0.88rem", wordBreak: "break-all" }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div className="progress-bar" style={{ height: 10 }}>
                  <div className="progress-fill" style={{ width: "60%" }} />
                </div>
              </div>
              <div className="panel">
                <div className="panel-head"><h3>Live Route Map</h3></div>
                <div className="route-map" style={{ minHeight: 260 }}>
                  <div className="map-grid" />
                  <svg viewBox="0 0 500 260" preserveAspectRatio="none">
                    <path className="river" d="M0,170 Q120,155 250,170 Q380,185 500,170" />
                    <path className="route-line" d="M80,60 Q180,80 250,140 Q320,195 400,210" />
                    <circle cx="80" cy="60" r="9" className="map-pulse hub" />
                    <circle cx="250" cy="140" r="13" className="map-pulse live" />
                    <circle cx="400" cy="210" r="9" className="map-pulse dest" />
                    <text x="90" y="55" className="map-label">Donor Kiosk</text>
                    <text x="260" y="134" className="map-label" fill="#fcd34d">En Route</text>
                    <text x="408" y="205" className="map-label">Shelter</text>
                  </svg>
                  <div className="map-stat-box"><span>ETA</span><strong style={{ color: "var(--gold)" }}>{donation.eta}</strong></div>
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-head"><h3>Verified Checkpoints</h3><span className="badge badge-teal">{donation.route.filter(r=>r.status==="complete").length}/{donation.route.length} Complete</span></div>
              <div className="panel-body">
                <div className="timeline" style={{ gap: 20 }}>
                  {donation.route.map((r) => (
                    <div key={r.label} className="timeline-item">
                      <div className={`tl-dot ${r.status==="complete"?"done":r.status==="current"?"active":"pending"}`} />
                      <div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                          <strong>{r.label}</strong>
                          <div className={`badge ${r.status==="complete"?"badge-success":r.status==="current"?"badge-info":"badge-medium"}`}>{r.status}</div>
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: 6 }}>{r.time} — {r.location}</div>
                        <div style={{ fontSize: "0.82rem", background: "rgba(255,255,255,0.04)", border: "1px solid var(--line)", borderRadius: 8, padding: "8px 12px" }}>{r.proof}</div>
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