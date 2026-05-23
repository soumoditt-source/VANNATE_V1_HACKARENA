import Link from "next/link";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-v">V</span>ANNATE
          <p>AI-Native Humanitarian Operating System</p>
          <p className="footer-motto">Vasudhaiva Kutumbakam &mdash; The world is one family</p>
          <div style={{ marginTop: 12, fontSize: "0.8rem", color: "var(--text-muted)", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", padding: "8px 12px", borderRadius: 8 }}>
            <strong>⚠️ Demo Platform:</strong> All systems shown are for hackathon demonstration only.
          </div>
        </div>
        <div className="footer-cols">
          <div>
            <h4>Platform</h4>
            <Link href="/dashboard">Donor Dashboard</Link>
            <Link href="/ngo">NGO Operations</Link>
            <Link href="/crisis">Crisis Center</Link>
            <Link href="/blood">Blood Bank</Link>
          </div>
          <div>
            <h4>Trust Engine</h4>
            <Link href="/trust">Beneficiary Verification</Link>
            <Link href="/verify">Verification Flow</Link>
            <Link href="/track">Live Donation Tracking</Link>
            <Link href="/volunteer">Volunteer Network</Link>
            <Link href="/analytics">Impact Analytics</Link>
          </div>
          <div>
            <h4>Tools</h4>
            <Link href="/copilot">AI Copilot</Link>
            <Link href="/community">Community Feed</Link>
            <Link href="/intro">App Intro</Link>
            <Link href="/info">API Architecture</Link>
          </div>
          <div>
            <h4>Legal</h4>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <span style={{ marginTop: 8, fontSize: "0.82rem", color: "var(--text-muted)" }}>NITI Aayog Reference</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 Vannate &mdash; TEAM FULLSTACK SHINOBI- SOUMODITYA DAS AND TEAM</span>
        <span className="footer-badge">AI for Humanity</span>
      </div>
    </footer>
  );
}