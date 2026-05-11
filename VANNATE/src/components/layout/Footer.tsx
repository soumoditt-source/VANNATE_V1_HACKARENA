import Link from "next/link";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-v">V</span>ANNATE
          <p>AI-Native Humanitarian Operating System</p>
          <p className="footer-motto">Vasudhaiva Kutumbakam &mdash; The world is one family</p>
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
            <h4>Tools</h4>
            <Link href="/volunteer">Volunteer Network</Link>
            <Link href="/copilot">AI Copilot</Link>
            <Link href="/analytics">Impact Analytics</Link>
          </div>
          <div>
            <h4>Stack</h4>
            <span>Next.js + TypeScript</span>
            <span>RAG + Ollama</span>
            <span>Qdrant Vector DB</span>
            <span>Supabase Postgres</span>
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