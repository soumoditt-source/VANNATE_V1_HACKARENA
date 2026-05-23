"use client";
import { useState } from "react";
import DynamicMap from "@/components/ui/DynamicMap";
import { liveApiCatalog } from "@/lib/live";
import BloodDonorAlertPanel, { type BloodRequest } from "@/components/ui/BloodDonorAlertPanel";

const inventory = [
  { group: "A+", units: 42, status: "adequate" },
  { group: "A-", units: 8,  status: "low" },
  { group: "B+", units: 35, status: "adequate" },
  { group: "B-", units: 5,  status: "critical" },
  { group: "O+", units: 28, status: "adequate" },
  { group: "O-", units: 3,  status: "critical" },
  { group: "AB+", units: 18, status: "adequate" },
  { group: "AB-", units: 2,  status: "critical" },
];

const donors = [
  { name: "Sanjay Mehta",   group: "O-",  dist: "1.2 km", eligible: true,  last: "Mar 2026", phone: "9051466483" },
  { name: "Ananya Sen",     group: "O-",  dist: "2.8 km", eligible: true,  last: "Jan 2026", phone: "9051466483" },
  { name: "Rahul Bose",     group: "B-",  dist: "3.1 km", eligible: false, last: "Apr 2026", phone: "9051466483" },
  { name: "Monika Das",     group: "AB-", dist: "4.5 km", eligible: true,  last: "Feb 2026", phone: "9051466483" },
];

const REQUESTS: BloodRequest[] = [
  {
    hospital: "Calcutta Medical College",
    address: "88, College St, Shyambazar, Kolkata, West Bengal 700073",
    group: "O-",
    units: 2,
    urgency: "critical",
    time: "15 min ago",
    contactName: "Dr. Priya Rao (Blood Bank Head)",
    contactPhone: "9051466483",
    hospitalLat: 22.5637,
    hospitalLng: 88.3666,
  },
  {
    hospital: "Behala General Hospital",
    address: "1, James Long Sarani, Behala, Kolkata, WB 700061",
    group: "B-",
    units: 1,
    urgency: "high",
    time: "42 min ago",
    contactName: "Sister Mary (Ward Nurse)",
    contactPhone: "9051466483",
    hospitalLat: 22.5090,
    hospitalLng: 88.3000,
  },
];

export default function BloodPage() {
  const [search, setSearch] = useState("O-");
  const [activeAlert, setActiveAlert] = useState<BloodRequest | null>(null);
  const [alertedDonor, setAlertedDonor] = useState<string | null>(null);

  const filtered = donors.filter(d => search === "" || d.group.toLowerCase().includes(search.toLowerCase()));

  function alertDonor(donor: typeof donors[0]) {
    const waMsg = encodeURIComponent(
      `🚨 URGENT — Vannate Blood Network\n\nDear ${donor.name},\nYour blood group *${donor.group}* is critically needed.\n\nHospital: Calcutta Medical College\nDistance from you: ${donor.dist}\n\nPlease confirm availability immediately.\nReply YES to receive hospital navigation.\n\n— Vannate AI Humanitarian OS`
    );
    const waLink = `https://wa.me/91${donor.phone}?text=${waMsg}`;
    setAlertedDonor(donor.name);
    window.open(waLink, "_blank");
    setTimeout(() => setAlertedDonor(null), 4000);
  }

  return (
    <div className="page-shell">
      {/* Alert Panel Overlay */}
      {activeAlert && (
        <BloodDonorAlertPanel request={activeAlert} onClose={() => setActiveAlert(null)} />
      )}

      <div className="page-hero" style={{ background: "linear-gradient(180deg,rgba(239,68,68,0.07),transparent)" }}>
        <div className="page-hero-inner">
          <div className="section-kicker" style={{ color: "var(--red)" }}>Smart Blood Bank</div>
          <h1>Save Lives with AI-Matched Blood</h1>
          <p>Real-time inventory tracking, geo-prioritized donor matching, hospital alerts, and eligibility verification for every blood group.</p>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">

          {/* Live Emergency Requests */}
          {REQUESTS.map((r) => (
            <div key={r.hospital} className="card card-sm" style={{
              marginBottom: 14,
              borderColor: r.urgency === "critical" ? "rgba(239,68,68,0.45)" : "rgba(245,158,11,0.35)",
              background: r.urgency === "critical" ? "rgba(239,68,68,0.06)" : "rgba(245,158,11,0.05)",
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
            }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", fontWeight: 900, color: "var(--red)" }}>+</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{r.hospital}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Needs <strong style={{ color: "var(--red)" }}>{r.units} unit{r.units > 1 ? "s" : ""} of {r.group}</strong> · {r.time}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <div className={`badge badge-${r.urgency}`}>{r.urgency.toUpperCase()}</div>
                <button
                  className="btn-danger btn-sm"
                  onClick={() => setActiveAlert(r)}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  🩸 Alert Donors →
                </button>
                <button
                  className="btn-outline btn-sm"
                  onClick={() => setActiveAlert(r)}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  👁 View Details
                </button>
              </div>
            </div>
          ))}

          {/* Alerted donor toast */}
          {alertedDonor && (
            <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, background: "#25D366", color: "#fff", padding: "12px 20px", borderRadius: 14, fontWeight: 700, boxShadow: "0 8px 32px rgba(37,211,102,0.4)", fontSize: "0.9rem" }}>
              ✅ WhatsApp alert sent to {alertedDonor}
            </div>
          )}

          <div className="responsive-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20 }}>
            <div>
              <div className="panel" style={{ marginBottom: 16 }}>
                <div className="panel-head"><h3>Live Inventory</h3><span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Updated now</span></div>
                <div className="panel-body">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                    {inventory.map((b) => (
                      <div key={b.group} className="metric-card" style={{
                        borderColor: b.status === "critical" ? "rgba(239,68,68,0.4)" : b.status === "low" ? "rgba(245,158,11,0.3)" : undefined,
                        textAlign: "center", cursor: "pointer",
                      }}
                        onClick={() => {
                          const req = REQUESTS.find(r => r.group === b.group);
                          if (req) setActiveAlert(req);
                        }}
                      >
                        <div style={{ fontSize: "1.3rem", fontWeight: 900, fontFamily: "'Playfair Display',serif", color: b.status === "critical" ? "var(--red)" : b.status === "low" ? "var(--gold)" : "var(--green)" }}>{b.group}</div>
                        <div style={{ fontSize: "1.4rem", fontWeight: 900, margin: "4px 0" }}>{b.units}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>units</div>
                        <div className={`badge badge-${b.status === "critical" ? "critical" : b.status === "low" ? "high" : "success"}`} style={{ marginTop: 6, fontSize: "0.7rem", display: "inline-flex" }}>{b.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card card-sm" style={{ borderColor: "rgba(20,184,166,0.3)", textAlign: "center", padding: 28 }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 12, color: "var(--red)" }}>+</div>
                <h3 style={{ marginBottom: 8 }}>Register as a Donor</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: 16 }}>Save up to 3 lives with one donation. Get reminders and hospital confirmation.</p>
                <a
                  href={`https://wa.me/919051466483?text=${encodeURIComponent("Hi Vannate, I want to register as a blood donor. Please guide me.")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}
                >
                  Register via WhatsApp →
                </a>
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <h3>AI Donor Finder</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input className="form-input" style={{ width: 80, padding: "6px 10px" }} placeholder="O-" value={search} onChange={e => setSearch(e.target.value)} />
                  <button className="btn-primary btn-sm">Search</button>
                </div>
              </div>
              <div className="panel-body">
                <div style={{ display: "grid", gap: 14 }}>
                  {filtered.map((d) => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid var(--line)", paddingBottom: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "999px", background: d.eligible ? "rgba(239,68,68,0.15)" : "var(--surface-2)", border: `2px solid ${d.eligible ? "rgba(239,68,68,0.4)" : "var(--line)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "var(--red)", flexShrink: 0, fontSize: "0.85rem" }}>{d.group}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{d.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 3 }}>{d.dist} · Last donated: {d.last}</div>
                        {!d.eligible && <div className="badge badge-high" style={{ marginTop: 4, fontSize: "0.72rem" }}>Cooling period active</div>}
                      </div>
                      <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
                        {d.eligible && (
                          <>
                            <button
                              className="btn-sm btn-danger"
                              onClick={() => alertDonor(d)}
                              style={{ display: "flex", alignItems: "center", gap: 4 }}
                            >
                              📲 Alert
                            </button>
                            <a
                              href={`tel:+91${d.phone}`}
                              className="btn-sm btn-outline"
                              style={{ display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}
                            >
                              📞 Call
                            </a>
                          </>
                        )}
                        {!d.eligible && <button className="btn-sm btn-outline" disabled>Not eligible</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, width: "100%", height: "60vh", borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(239,68,68,0.15)" }}>
            <DynamicMap />
          </div>

          <div className="panel" style={{ marginTop: 20 }}>
            <div className="panel-head">
              <h3>Blood Bank API Readiness</h3>
              <span className="badge badge-info">free-first</span>
            </div>
            <div className="panel-body api-ready-grid">
              {liveApiCatalog
                .filter((api) => ["Free live map tiles", "Production routing and distance matrix", "Geocoding and reverse geocoding", "Live database and auth", "Push notifications"].includes(api.need))
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
