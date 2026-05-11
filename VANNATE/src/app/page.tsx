import type { Metadata } from "next";
import Link from "next/link";
import MorphingBackground from "@/components/ui/MorphingBackground";
import IntroSequence from "@/components/ui/IntroSequence";

export const metadata: Metadata = {
  title: "Vannate | AI Humanitarian Operating System",
  description: "Transform NGO operations, donation trust, and emergency response with AI-driven intelligence. Built for humanity.",
};

const pillars = [
  { icon: "T", title: "Trust Engine", desc: "Live VTS score built from registration, activity, confirmations, and fraud signals.", href: "/analytics" },
  { icon: "D", title: "Donation Tracking", desc: "Every rupee tracked from donor scan to beneficiary handoff with QR proof.", href: "/dashboard" },
  { icon: "C", title: "Crisis Response", desc: "Heatmaps, dispatch, shortage forecasting for any disaster. Real-time.", href: "/crisis" },
  { icon: "B", title: "Smart Blood Bank", desc: "Geo-matched rare donors, hospital alerts, eligibility AI. Zero delays.", href: "/blood" },
  { icon: "V", title: "Volunteer Network", desc: "Skill-matched dispatch for every mission. Track reliability in real time.", href: "/volunteer" },
  { icon: "A", title: "AI Copilot", desc: "RAG-powered assistant for grants, compliance, reports, and translation.", href: "/copilot" },
];

const stats = [
  { n: "1.2L+", label: "Beneficiaries Served", c: "teal" },
  { n: "Rs.8.4Cr", label: "Aid Tracked Live", c: "gold" },
  { n: "317", label: "Verified NGOs", c: "green" },
  { n: "8", label: "Languages", c: "teal" },
  { n: "99.2%", label: "Delivery Rate", c: "green" },
];

const agents = ["Donation Intelligence","NGO Copilot","Emergency Response","Fraud Detection","Volunteer Scheduler","Logistics Optimization","Impact Analytics","Translation Engine","Voice Assistant"];

const steps = [
  { n: "01", title: "Verify & Onboard", body: "Every NGO and donor gets a QR-backed identity with a Vannate Trust Score computed from on-chain signals." },
  { n: "02", title: "Give with Confidence", body: "AI matches donor preferences to verified campaigns. Every rupee is cryptographically logged from source to destination." },
  { n: "03", title: "Track Every Step", body: "Live route map shows your donation moving from NGO hub to field volunteer to confirmed beneficiary with photo proof." },
  { n: "04", title: "Measure Real Impact", body: "Analytics dashboards show SDG alignment, lives touched, fraud prevented, and trust scores updated in real time." },
];

export default function HomePage() {
  return (
    <>
      <IntroSequence />

      {/* Hero */}
      <section className="page-hero" style={{ minHeight: "92vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
        <MorphingBackground />
        <div className="page-hero-inner" style={{ position: "relative", zIndex: 2 }}>
          <div className="hero-eyebrow">
            <span />
            <span>Humanitarian OS &mdash; 2026 Edition</span>
          </div>
          <h1 style={{ fontSize: "clamp(2.4rem,6vw,5rem)", maxWidth: 900 }}>
            The AI Platform That Makes<br />
            <span style={{ color: "var(--teal)", fontFamily: "'Playfair Display', serif" }}>Giving Trustworthy</span>
          </h1>
          <p style={{ fontSize: "1.15rem", maxWidth: 620, color: "var(--text-muted)", lineHeight: 1.75, marginTop: 20 }}>
            Vannate is an AI-native humanitarian operating system &mdash; combining donation transparency, crisis response, blood bank intelligence, and NGO automation into one platform.
          </p>
          <div className="hero-motto">
            <p>Vasudhaiva Kutumbakam</p>
            <span>The world is one family &mdash; ancient Sanskrit wisdom, made digital.</span>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 36, flexWrap: "wrap" }}>
            <Link href="/dashboard" className="btn-primary" style={{ fontSize: "1rem", padding: "14px 28px" }}>Start Giving &rarr;</Link>
            <Link href="/copilot" className="btn-ghost" style={{ fontSize: "1rem", padding: "14px 28px" }}>Talk to Vanna AI</Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: "var(--glass)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "28px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20 }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 900, fontFamily: "'Playfair Display', serif", color: `var(--${s.c})` }}>{s.n}</div>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Six Pillars */}
      <section className="section">
        <div className="section-inner">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="section-kicker">Six Pillars</div>
            <h2>Everything a Humanitarian Platform Needs</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: 580, margin: "16px auto 0", lineHeight: 1.75 }}>
              From a donor&apos;s first click to a beneficiary&apos;s confirmed receipt &mdash; every touchpoint is AI-verified.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {pillars.map(p => (
              <Link key={p.title} href={p.href} className="pillar-link">
                <div className="card pillar-card-item" style={{ padding: 28 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "var(--teal-2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "1.5rem", color: "var(--teal)", marginBottom: 18 }}>{p.icon}</div>
                  <h3>{p.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.65, marginBottom: 16 }}>{p.desc}</p>
                  <span className="pillar-arrow">Explore &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="section-inner">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="section-kicker">How It Works</div>
            <h2>From Donor Intent to Proven Impact</h2>
          </div>
          <div className="flow-steps">
            {steps.map(s => (
              <div key={s.n} className="flow-step">
                <div className="flow-num">{s.n}</div>
                <div>
                  <strong>{s.title}</strong>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents */}
      <section className="section">
        <div className="section-inner">
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div className="section-kicker">Nine AI Agents</div>
            <h2>Coordinated Intelligence, One Mission</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: 560, margin: "16px auto 0", lineHeight: 1.75 }}>Each specialized agent handles its domain. Together they form a humanitarian AI mesh that never sleeps.</p>
          </div>
          <div className="agents-grid">
            {agents.map(a => (
              <div key={a} className="agent-chip">
                <span className="agent-dot" />
                {a}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2>Ready to Build a More Compassionate World?</h2>
          <p>Join 317 verified NGOs, 12,000+ donors, and 124 active volunteers already on the Vannate network.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" className="btn-primary" style={{ fontSize: "1rem", padding: "14px 32px" }}>Get Started Free &rarr;</Link>
            <Link href="/ngo" className="btn-ghost" style={{ fontSize: "1rem", padding: "14px 32px" }}>For NGOs</Link>
          </div>
        </div>
      </section>
    </>
  );
}