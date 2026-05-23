"use client";
import { useState } from "react";

const skills = ["Medical First Aid","Logistics","Translation","Photography","IT Support","Cooking","Counseling","Driving"];
const volunteers = [
  { name: "Riya Chatterjee",  skill: "Medical First Aid",           zone: "South Kolkata", rating: 4.9, tasks: 28, status: "available", phone: "9051466483" },
  { name: "Arjun Das",        skill: "Logistics & Routing",         zone: "Howrah",        rating: 4.7, tasks: 42, status: "available", phone: "9051466483" },
  { name: "Priya Nair",       skill: "Translator (Tamil/Hindi)",    zone: "Salt Lake",     rating: 4.8, tasks: 15, status: "on-task",  phone: "9051466483" },
  { name: "Soham Roy",        skill: "Photography & Documentation", zone: "Behala",        rating: 4.6, tasks: 33, status: "available", phone: "9051466483" },
  { name: "Meera Singh",      skill: "Cooking & Nutrition",         zone: "Barasat",       rating: 5.0, tasks: 19, status: "available", phone: "9051466483" },
  { name: "Debraj Mukherjee", skill: "Counseling & Mental Health",  zone: "New Town",      rating: 4.9, tasks: 11, status: "on-task",  phone: "9051466483" },
];
const tasks = [
  { id: "TSK-001", title: "Medical camp setup",     zone: "Howrah Sector 4", urgency: "critical", volunteers: 3, deadline: "Today 2PM" },
  { id: "TSK-002", title: "Food kit distribution",  zone: "Behala",          urgency: "high",     volunteers: 5, deadline: "Today 5PM" },
  { id: "TSK-003", title: "Flood relief photography",zone:"Vidyasagar",      urgency: "medium",   volunteers: 1, deadline: "Tomorrow" },
];

function StarRating({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span style={{ color: "var(--gold)", fontSize: "0.88rem", letterSpacing: "1px" }}>
      {"★".repeat(full)}{"☆".repeat(5 - full)}{" "}{rating.toFixed(1)}
    </span>
  );
}

type DispatchState = { vol: string; task: string } | null;

export default function VolunteerPage() {
  const [filter, setFilter] = useState("all");
  const [dispatched, setDispatched] = useState<DispatchState>(null);
  const [toast, setToast] = useState<string | null>(null);
  const shown = filter === "all" ? volunteers : volunteers.filter(v => v.status === filter);

  function dispatchVolunteer(vol: typeof volunteers[0], task: typeof tasks[0]) {
    const waMsg = encodeURIComponent(
      `🚨 DISPATCH ALERT — Vannate Volunteer Network\n\nDear ${vol.name},\nYou have been assigned to:\n\n📋 Mission: ${task.title}\n📍 Zone: ${task.zone}\n⏰ Deadline: ${task.deadline}\n🔴 Urgency: ${task.urgency.toUpperCase()}\n\nPlease confirm receipt and proceed immediately.\n\n— Vannate Command Center`
    );
    window.open(`https://wa.me/91${vol.phone}?text=${waMsg}`, "_blank");
    setDispatched({ vol: vol.name, task: task.title });
    setToast(`✅ ${vol.name} dispatched to "${task.title}"`);
    setTimeout(() => setToast(null), 4000);
  }

  function alertAll(task: typeof tasks[0]) {
    const available = volunteers.filter(v => v.status === "available").slice(0, task.volunteers);
    if (available.length === 0) return;
    const names = available.map(v => v.name).join(", ");
    const waMsg = encodeURIComponent(
      `🚨 URGENT MISSION — Vannate\n\n📋 ${task.title}\n📍 Zone: ${task.zone}\n⏰ Deadline: ${task.deadline}\n\nNeeded: ${task.volunteers} volunteers\n\nReply YES to confirm. Location will follow.`
    );
    // Open WhatsApp for the first available volunteer
    window.open(`https://wa.me/91${available[0].phone}?text=${waMsg}`, "_blank");
    setToast(`📲 Alert sent to ${names}`);
    setTimeout(() => setToast(null), 4000);
  }

  return (
    <div className="page-shell">

      {/* Toast notification */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, background: "var(--teal)", color: "#fff", padding: "12px 20px", borderRadius: 14, fontWeight: 700, boxShadow: "0 8px 32px rgba(20,184,166,0.4)", fontSize: "0.9rem", maxWidth: 320 }}>
          {toast}
        </div>
      )}

      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-kicker">Volunteer Network</div>
          <h1>Match Skills to Missions</h1>
          <p>AI-powered volunteer dispatch matches skills, availability, location, and task urgency to put the right person in the right place.</p>
          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <a
              href={`https://wa.me/919051466483?text=${encodeURIComponent("Hi Vannate, I want to register as a volunteer. Please guide me.")}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-primary"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              Register via WhatsApp →
            </a>
            <button className="btn-ghost" onClick={() => document.getElementById("open-missions")?.scrollIntoView({ behavior: "smooth" })}>
              View Open Tasks
            </button>
          </div>
        </div>
      </div>

      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
            {[["124","Active Volunteers","teal"],["28","On Task Now","gold"],["97%","Reliability Score","green"],["3","Open Missions","red"]].map(([n,l,c]) => (
              <div key={l} className="metric-card">
                <div className="metric-val" style={{ color: `var(--${c})` }}>{n}</div>
                <div className="metric-lbl">{l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
            <div className="panel">
              <div className="panel-head">
                <h3>Volunteer Network</h3>
                <div style={{ display: "flex", gap: 8 }}>
                  {["all","available","on-task"].map(f => (
                    <button key={f} className={filter === f ? "btn-primary btn-sm" : "btn-outline btn-sm"} onClick={() => setFilter(f)}>
                      {f === "all" ? "All" : f === "available" ? "Available" : "On Task"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="panel-body" style={{ display: "grid", gap: 14 }}>
                {shown.map((v) => (
                  <div key={v.name} style={{ display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid var(--line)", paddingBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "999px", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0, border: "2px solid var(--line)" }}>
                      {v.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700 }}>{v.name}</span>
                        <div className={`badge ${v.status === "available" ? "badge-success" : "badge-info"}`}>{v.status}</div>
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{v.skill} · {v.zone}</div>
                      <div style={{ fontSize: "0.8rem", marginTop: 4 }}><StarRating rating={v.rating} /> · {v.tasks} tasks</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {v.status === "available" && (
                        <>
                          <button
                            className="btn-primary btn-sm"
                            onClick={() => dispatchVolunteer(v, tasks[0])}
                            style={{ display: "flex", alignItems: "center", gap: 4 }}
                          >
                            📲 Dispatch
                          </button>
                          <a
                            href={`tel:+91${v.phone}`}
                            className="btn-outline btn-sm"
                            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
                          >
                            📞 Call
                          </a>
                        </>
                      )}
                      {v.status === "on-task" && (
                        <button className="btn-outline btn-sm" disabled>On Task</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
              <div className="panel" id="open-missions">
                <div className="panel-head"><h3>Open Missions</h3><span className="badge badge-critical">3 urgent</span></div>
                <div className="panel-body" style={{ display: "grid", gap: 12 }}>
                  {tasks.map((t) => (
                    <div key={t.id} className="card card-sm" style={{ padding: 16, borderColor: t.urgency === "critical" ? "rgba(239,68,68,0.35)" : undefined }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "var(--text-muted)" }}>{t.id}</span>
                        <div className={`badge badge-${t.urgency === "critical" ? "critical" : t.urgency === "high" ? "high" : "medium"}`}>{t.urgency}</div>
                      </div>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>{t.title}</div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 12 }}>{t.zone} · {t.volunteers} needed · {t.deadline}</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          className="btn-primary btn-sm"
                          onClick={() => alertAll(t)}
                          style={{ display: "flex", alignItems: "center", gap: 4 }}
                        >
                          📲 Alert All Available
                        </button>
                        <a
                          href={`https://wa.me/919051466483?text=${encodeURIComponent(`MISSION: ${t.title}\nZone: ${t.zone}\nDeadline: ${t.deadline}`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="btn-outline btn-sm"
                          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
                        >
                          WhatsApp Command →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-head"><h3>Skills Available</h3></div>
                <div className="panel-body" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {skills.map((s) => <span key={s} className="badge badge-info" style={{ padding: "6px 12px" }}>{s}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}