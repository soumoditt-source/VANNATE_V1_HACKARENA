"use client";
import { useState } from "react";

const skills = ["Medical First Aid","Logistics","Translation","Photography","IT Support","Cooking","Counseling","Driving"];
const volunteers = [
  { name: "Riya Chatterjee", skill: "Medical First Aid", zone: "South Kolkata", rating: 4.9, tasks: 28, status: "available" },
  { name: "Arjun Das", skill: "Logistics & Routing", zone: "Howrah", rating: 4.7, tasks: 42, status: "available" },
  { name: "Priya Nair", skill: "Translator (Tamil/Hindi)", zone: "Salt Lake", rating: 4.8, tasks: 15, status: "on-task" },
  { name: "Soham Roy", skill: "Photography & Documentation", zone: "Behala", rating: 4.6, tasks: 33, status: "available" },
  { name: "Meera Singh", skill: "Cooking & Nutrition", zone: "Barasat", rating: 5.0, tasks: 19, status: "available" },
  { name: "Debraj Mukherjee", skill: "Counseling & Mental Health", zone: "New Town", rating: 4.9, tasks: 11, status: "on-task" },
];
const tasks = [
  { id: "TSK-001", title: "Medical camp setup", zone: "Howrah Sector 4", urgency: "critical", volunteers: 3, deadline: "Today 2PM" },
  { id: "TSK-002", title: "Food kit distribution", zone: "Behala", urgency: "high", volunteers: 5, deadline: "Today 5PM" },
  { id: "TSK-003", title: "Flood relief photography", zone: "Vidyasagar", urgency: "medium", volunteers: 1, deadline: "Tomorrow" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: "var(--gold)", fontSize: "0.85rem" }}>
      {"*".repeat(Math.round(rating))} {rating}
    </span>
  );
}

export default function VolunteerPage() {
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? volunteers : volunteers.filter(v => v.status === filter);

  return (
    <div className="page-shell">
      <div className="page-hero">
        <div className="page-hero-inner">
          <div className="section-kicker">Volunteer Network</div>
          <h1>Match Skills to Missions</h1>
          <p>AI-powered volunteer dispatch matches skills, availability, location, and task urgency to put the right person in the right place.</p>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button className="btn-primary">Register as Volunteer &rarr;</button>
            <button className="btn-ghost">View Open Tasks</button>
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
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700 }}>{v.name}</span>
                        <div className={`badge ${v.status === "available" ? "badge-success" : "badge-info"}`}>{v.status}</div>
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{v.skill} &middot; {v.zone}</div>
                      <div style={{ fontSize: "0.8rem", marginTop: 4 }}><StarRating rating={v.rating} /> &middot; {v.tasks} tasks completed</div>
                    </div>
                    <button className="btn-outline btn-sm" disabled={v.status !== "available"}>Dispatch</button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
              <div className="panel">
                <div className="panel-head"><h3>Open Missions</h3><span className="badge badge-critical">3 urgent</span></div>
                <div className="panel-body" style={{ display: "grid", gap: 12 }}>
                  {tasks.map((t) => (
                    <div key={t.id} className="card card-sm" style={{ padding: 16, borderColor: t.urgency === "critical" ? "rgba(239,68,68,0.35)" : undefined }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "var(--text-muted)" }}>{t.id}</span>
                        <div className={`badge badge-${t.urgency === "critical" ? "critical" : t.urgency === "high" ? "high" : "medium"}`}>{t.urgency}</div>
                      </div>
                      <div style={{ fontWeight: 700, marginBottom: 6 }}>{t.title}</div>
                      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{t.zone} &middot; {t.volunteers} needed &middot; {t.deadline}</div>
                      <button className="btn-primary btn-sm" style={{ marginTop: 12 }}>Assign Volunteers &rarr;</button>
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