"use client";
import { useState, useEffect } from "react";

type Metrics = {
  totalDonors: number;
  activeCampaigns: number;
  fundsRaised: string;
  conversionRate: string;
  recentActivities: Array<{ id: number; action: string; detail: string; time: string; type: "donation" | "campaign" | "volunteer" }>;
};

const DONORS = [
  { id: 1, name: "Ananya Bose", email: "ananya@gmail.com", total: "₹24,500", campaigns: 4, status: "Active", badge: "Champion" },
  { id: 2, name: "Rahul Sharma", email: "rahul@outlook.com", total: "₹12,000", campaigns: 2, status: "Active", badge: "Supporter" },
  { id: 3, name: "Priya Mehta", email: "priya.m@yahoo.com", total: "₹8,750", campaigns: 3, status: "Active", badge: "Supporter" },
  { id: 4, name: "Arjun Nair", email: "arjun.nair@gmail.com", total: "₹3,200", campaigns: 1, status: "New", badge: "Newcomer" },
  { id: 5, name: "Suchitra Das", email: "suchi@gmail.com", total: "₹51,000", campaigns: 8, status: "Active", badge: "Champion" },
  { id: 6, name: "Vikram Singh", email: "vikram.s@corp.in", total: "₹1,25,000", campaigns: 12, status: "VIP", badge: "Platinum" },
];

const CAMPAIGNS = [
  { id: 1, name: "Clean Water Initiative", raised: "₹4,20,000", goal: "₹5,00,000", pct: 84, status: "Active", sdg: "SDG 6", donors: 312 },
  { id: 2, name: "Education for All 2026", raised: "₹2,95,000", goal: "₹3,00,000", pct: 98, status: "Nearly Done", sdg: "SDG 4", donors: 198 },
  { id: 3, name: "Cyclone Sundarbans Relief", raised: "₹8,10,000", goal: "₹10,00,000", pct: 81, status: "Active", sdg: "SDG 13", donors: 571 },
  { id: 4, name: "Blood Bank Expansion", raised: "₹1,50,000", goal: "₹4,00,000", pct: 37, status: "Active", sdg: "SDG 3", donors: 89 },
  { id: 5, name: "Volunteer Training Academy", raised: "₹67,000", goal: "₹2,00,000", pct: 33, status: "New", sdg: "SDG 17", donors: 41 },
];

const BADGE_COLORS: Record<string, string> = {
  Platinum: "#a78bfa",
  Champion: "#14b8a6",
  Supporter: "#f59e0b",
  Newcomer: "#6b7280",
};

const ACT_ICONS: Record<string, string> = {
  donation: "💳",
  campaign: "🎯",
  volunteer: "🤝",
};

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "donors" | "campaigns">("overview");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setMetrics({
        totalDonors: 14205,
        activeCampaigns: 12,
        fundsRaised: "₹45,20,000",
        conversionRate: "68.4%",
        recentActivities: [
          { id: 1, action: "New Donation", detail: "₹5,000 for Clean Water Initiative by Ananya Bose", time: "10 mins ago", type: "donation" },
          { id: 2, action: "Campaign Goal Reached", detail: "Education for All 2026 hit 98% of ₹3L target", time: "1 hour ago", type: "campaign" },
          { id: 3, action: "Volunteer Registered", detail: "Aarav Sharma joined Flood Response Team in Mumbai", time: "3 hours ago", type: "volunteer" },
          { id: 4, action: "New Donation", detail: "₹1,25,000 CSR grant from Vikram Singh", time: "5 hours ago", type: "donation" },
          { id: 5, action: "Campaign Launched", detail: "Volunteer Training Academy — ₹2L goal set", time: "Yesterday", type: "campaign" },
        ],
      });
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const filteredDonors = DONORS.filter(
    d => d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", padding: "100px 5vw 4rem", background: "var(--bg-main)", color: "var(--text-main)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.78rem", letterSpacing: "0.12em", color: "var(--teal)", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
              NGO Intelligence Platform
            </div>
            <h1 style={{ fontSize: "clamp(2rem,4vw,2.8rem)", fontFamily: "var(--font-playfair, 'Playfair Display', serif)", color: "var(--gold, #f2ca50)", marginBottom: 6 }}>
              Vannate CRM
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
              Donor relationships, campaign analytics &amp; volunteer intelligence — all in one OS.
            </p>
          </div>
          <button className="btn-primary" style={{ padding: "0.8rem 1.6rem", flexShrink: 0 }}>
            ⬇ Export Report
          </button>
        </header>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))", paddingBottom: "0" }}>
          {(["overview", "donors", "campaigns"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                color: activeTab === tab ? "var(--teal)" : "var(--text-muted)",
                fontSize: "1rem",
                fontWeight: activeTab === tab ? 700 : 400,
                cursor: "pointer",
                textTransform: "capitalize",
                padding: "0.6rem 1.2rem",
                borderBottom: activeTab === tab ? "2px solid var(--teal)" : "2px solid transparent",
                transition: "all 0.25s ease",
                marginBottom: -1,
              }}
            >
              {tab === "overview" ? "📊 Overview" : tab === "donors" ? "👥 Donors" : "🎯 Campaigns"}
            </button>
          ))}
        </div>

        {/* Loading */}
        {!metrics ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "5rem", gap: 12, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, border: "3px solid var(--teal)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <span style={{ color: "var(--text-muted)" }}>Loading CRM data...</span>
          </div>
        ) : (
          <>
            {/* ─── OVERVIEW ─── */}
            {activeTab === "overview" && (
              <>
                {/* KPI Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.2rem", marginBottom: "2.5rem" }}>
                  {[
                    { label: "Total Donors", value: metrics.totalDonors.toLocaleString("en-IN"), color: "var(--teal)", icon: "👥" },
                    { label: "Active Campaigns", value: metrics.activeCampaigns, color: "var(--gold, #f2ca50)", icon: "🎯" },
                    { label: "Funds Raised (YTD)", value: metrics.fundsRaised, color: "#a78bfa", icon: "💰" },
                    { label: "Conversion Rate", value: metrics.conversionRate, color: "#34d399", icon: "📈" },
                  ].map(k => (
                    <div key={k.label} className="card" style={{ padding: "1.4rem 1.6rem" }}>
                      <div style={{ fontSize: "1.6rem", marginBottom: 10 }}>{k.icon}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{k.label}</div>
                      <div style={{ fontSize: "2rem", fontWeight: 800, color: k.color }}>{String(k.value)}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="card" style={{ padding: "1.8rem" }}>
                  <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem", color: "var(--text-main)" }}>Recent Activity</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    {metrics.recentActivities.map(act => (
                      <div key={act.id} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "1rem 1.2rem", background: "rgba(255,255,255,0.03)",
                        borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)",
                        flexWrap: "wrap", gap: 8,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: "1.5rem" }}>{ACT_ICONS[act.type]}</span>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 2 }}>{act.action}</div>
                            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{act.detail}</div>
                          </div>
                        </div>
                        <div style={{ color: "var(--teal)", fontSize: "0.82rem", fontWeight: 500, whiteSpace: "nowrap" }}>{act.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ─── DONORS ─── */}
            {activeTab === "donors" && (
              <div className="card" style={{ padding: "1.8rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.4rem", flexWrap: "wrap", gap: 12 }}>
                  <h2 style={{ fontSize: "1.2rem" }}>Donor Directory</h2>
                  <input
                    className="form-input"
                    style={{ maxWidth: 280 }}
                    placeholder="Search donors..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))" }}>
                        {["Donor", "Email", "Total Given", "Campaigns", "Badge", "Status"].map(h => (
                          <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonors.map(d => (
                        <tr key={d.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "")}>
                          <td style={{ padding: "12px", fontWeight: 600 }}>{d.name}</td>
                          <td style={{ padding: "12px", color: "var(--text-muted)" }}>{d.email}</td>
                          <td style={{ padding: "12px", color: "var(--teal)", fontWeight: 700 }}>{d.total}</td>
                          <td style={{ padding: "12px", textAlign: "center" }}>{d.campaigns}</td>
                          <td style={{ padding: "12px" }}>
                            <span style={{ padding: "3px 10px", borderRadius: "20px", background: `${BADGE_COLORS[d.badge] || "#6b7280"}22`, color: BADGE_COLORS[d.badge] || "#6b7280", fontSize: "0.78rem", fontWeight: 700, border: `1px solid ${BADGE_COLORS[d.badge] || "#6b7280"}55` }}>
                              {d.badge}
                            </span>
                          </td>
                          <td style={{ padding: "12px" }}>
                            <span style={{ padding: "3px 10px", borderRadius: "20px", background: d.status === "VIP" ? "rgba(167,139,250,0.15)" : d.status === "Active" ? "rgba(20,184,166,0.1)" : "rgba(255,255,255,0.05)", color: d.status === "VIP" ? "#a78bfa" : d.status === "Active" ? "var(--teal)" : "var(--text-muted)", fontSize: "0.78rem", fontWeight: 600 }}>
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredDonors.length === 0 && (
                    <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>No donors found for &ldquo;{search}&rdquo;</div>
                  )}
                </div>
                <div style={{ marginTop: "1rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  Showing {filteredDonors.length} of {DONORS.length} donors · Synced with Supabase PostgreSQL
                </div>
              </div>
            )}

            {/* ─── CAMPAIGNS ─── */}
            {activeTab === "campaigns" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {CAMPAIGNS.map(c => (
                  <div key={c.id} className="card" style={{ padding: "1.5rem 1.8rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: "1rem" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{c.name}</h3>
                          <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "12px", background: "rgba(20,184,166,0.1)", color: "var(--teal)", border: "1px solid rgba(20,184,166,0.3)" }}>{c.sdg}</span>
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{c.donors} donors · Goal: {c.goal}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "1.4rem", fontWeight: 800, color: c.pct >= 90 ? "var(--teal)" : c.pct >= 60 ? "#f59e0b" : "var(--text-main)" }}>{c.raised}</div>
                        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{c.pct}% raised</div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${c.pct}%`,
                        borderRadius: 4,
                        background: c.pct >= 90 ? "linear-gradient(90deg,var(--teal),#34d399)" : c.pct >= 60 ? "linear-gradient(90deg,#f59e0b,#fbbf24)" : "linear-gradient(90deg,#8b5cf6,#a78bfa)",
                        transition: "width 1s ease",
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                      <span style={{ fontSize: "0.78rem", padding: "2px 10px", borderRadius: "12px", background: c.status === "Nearly Done" ? "rgba(20,184,166,0.1)" : "rgba(255,255,255,0.04)", color: c.status === "Nearly Done" ? "var(--teal)" : "var(--text-muted)" }}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { 100% { transform: rotate(360deg); } }` }} />
      </div>
    </div>
  );
}
