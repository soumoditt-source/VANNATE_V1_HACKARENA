export default function TermsPage() {
  return (
    <div className="page-shell">
      <div className="section">
        <div className="section-inner">
          <div className="panel">
            <div className="panel-head">
              <h1>Terms of Service</h1>
              <span className="badge badge-teal">Vannate AI</span>
            </div>
            <div className="panel-body" style={{ maxWidth: 900 }}>
              <div style={{ lineHeight: 1.8, color: "var(--text)" }}>
                <h3 style={{ marginTop: 0 }}>1. Acceptance of Terms</h3>
                <p>By accessing and using Vannate AI, you agree to these Terms of Service. Vannate is a humanitarian technology platform designed for disaster relief, blood donation coordination, and NGO operations support.</p>

                <h3 style={{ marginTop: 24 }}>2. Platform Purpose</h3>
                <p>Vannate AI operates as a trust engine for humanitarian aid. We facilitate transparent donations, beneficiary verification, and crisis response coordination. This is a demonstration platform for hackathon purposes.</p>

                <h3 style={{ marginTop: 24 }}>3. Verification & Trust</h3>
                <p><strong>NITI Aayog Reference:</strong> Vannate AI demonstrates integration with government-verified systems. For production deployment, actual NITI Aayog NGO Darpan API integration would be required.</p>
                <p>All beneficiary and NGO verification in this demo is simulated. For real-world use, proper KYC/AML checks and government API integrations are mandatory.</p>

                <h3 style={{ marginTop: 24 }}>4. User Responsibilities</h3>
                <ul style={{ margin: "8px 0 16px 20px" }}>
                  <li>Provide accurate information during registration</li>
                  <li>Use the platform only for lawful humanitarian purposes</li>
                  <li>Respect privacy and confidentiality of beneficiaries</li>
                  <li>Comply with all applicable Indian laws and regulations</li>
                </ul>

                <h3 style={{ marginTop: 24 }}>5. Data Privacy</h3>
                <p>Please refer to our Privacy Policy for details on data collection, storage, and usage. We prioritize user privacy and follow Indian data protection principles.</p>

                <h3 style={{ marginTop: 24 }}>6. Disclaimer</h3>
                <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 12, padding: 16, margin: "12px 0" }}>
                  <strong style={{ color: "#f59e0b" }}>DEMO PLATFORM DISCLAIMER:</strong>
                  <p style={{ marginTop: 8, marginBottom: 0, fontSize: "0.95rem" }}>This is a hackathon demonstration project. All verification systems, payment tracking, and NGO data shown are for demonstration purposes only and do not represent real transactions or actual verifications. For production use, proper regulatory approvals, government API integrations, and security audits would be required.</p>
                </div>

                <h3 style={{ marginTop: 24 }}>7. Intellectual Property</h3>
                <p>Vannate AI, its logo, and all content are protected intellectual property. The 3D visualization components, UI design, and technology stack are proprietary to Team Fullstack Shinobi.</p>

                <h3 style={{ marginTop: 24 }}>8. Limitation of Liability</h3>
                <p>Vannate AI is provided "as is" without warranties of any kind. We are not liable for any damages arising from the use of this demo platform.</p>

                <h3 style={{ marginTop: 24 }}>9. Governing Law</h3>
                <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Kolkata, West Bengal.</p>

                <h3 style={{ marginTop: 24 }}>10. Contact</h3>
                <p>For inquiries, contact Team Fullstack Shinobi - Soumoditya Das and Team.</p>

                <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Last updated: May 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
