export default function PrivacyPage() {
  return (
    <div className="page-shell">
      <div className="section">
        <div className="section-inner">
          <div className="panel">
            <div className="panel-head">
              <h1>Privacy Policy</h1>
              <span className="badge badge-blue">Data Protection</span>
            </div>
            <div className="panel-body" style={{ maxWidth: 900 }}>
              <div style={{ lineHeight: 1.8, color: "var(--text)" }}>
                <h3 style={{ marginTop: 0 }}>1. Information We Collect</h3>
                <p>Vannate AI collects information necessary to provide humanitarian services:</p>
                <ul style={{ margin: "8px 0 16px 20px" }}>
                  <li><strong>User Account Data:</strong> Name, contact information, location</li>
                  <li><strong>Beneficiary Data:</strong> For verification and aid coordination</li>
                  <li><strong>Location Data:</strong> For crisis response and resource allocation</li>
                  <li><strong>Usage Data:</strong> Platform interaction analytics</li>
                </ul>

                <h3 style={{ marginTop: 24 }}>2. How We Use Data</h3>
                <p>All data is used exclusively for humanitarian purposes:</p>
                <ul style={{ margin: "8px 0 16px 20px" }}>
                  <li>Coordinate disaster relief efforts</li>
                  <li>Match blood donors with recipients</li>
                  <li>Verify beneficiary eligibility</li>
                  <li>Track donation transparency</li>
                  <li>Improve platform services</li>
                </ul>

                <h3 style={{ marginTop: 24 }}>3. Data Security</h3>
                <p>We implement industry-standard security measures:</p>
                <ul style={{ margin: "8px 0 16px 20px" }}>
                  <li>End-to-end encryption for sensitive data</li>
                  <li>Secure cloud storage</li>
                  <li>Access controls and authentication</li>
                  <li>Regular security audits</li>
                </ul>

                <h3 style={{ marginTop: 24 }}>4. Data Sharing</h3>
                <p>Data is shared only with:</p>
                <ul style={{ margin: "8px 0 16px 20px" }}>
                  <li>Verified NGOs and humanitarian organizations</li>
                  <li>Government authorities for disaster response</li>
                  <li>With explicit user consent</li>
                </ul>

                <h3 style={{ marginTop: 24 }}>5. User Rights</h3>
                <p>Users have the right to:</p>
                <ul style={{ margin: "8px 0 16px 20px" }}>
                  <li>Access their personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Request data deletion</li>
                  <li>Withdraw consent</li>
                </ul>

                <h3 style={{ marginTop: 24 }}>6. Demo Platform Notice</h3>
                <div style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: 16, margin: "12px 0" }}>
                  <strong style={{ color: "#8b5cf6" }}>DEMO PRIVACY NOTICE:</strong>
                  <p style={{ marginTop: 8, marginBottom: 0, fontSize: "0.95rem" }}>This is a demonstration project. No real personal data is collected or stored in this demo. All data shown is synthetic for presentation purposes only.</p>
                </div>

                <h3 style={{ marginTop: 24 }}>7. Compliance</h3>
                <p>Vannate AI is designed to comply with:</p>
                <ul style={{ margin: "8px 0 16px 20px" }}>
                  <li>Digital Personal Data Protection Act (DPDPA), India</li>
                  <li>Information Technology Act, 2000</li>
                  <li>National Disaster Management Guidelines</li>
                </ul>

                <h3 style={{ marginTop: 24 }}>8. Contact</h3>
                <p>For privacy-related inquiries, contact our Data Protection Officer.</p>

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
