"use client";

import { useState } from "react";
import DonorDashboard from "@/components/dashboards/DonorDashboard";
import KioskDashboard from "@/components/dashboards/KioskDashboard";
import NgoDashboard from "@/components/dashboards/NgoDashboard";
import { PortalProvider } from "@/components/dashboards/PortalContext";

export default function UnifiedPortal() {
  const [activeRole, setActiveRole] = useState<"DONOR" | "KIOSK" | "NGO">("DONOR");

  return (
    <PortalProvider>
      <div style={{ minHeight: "100vh", background: "#020617", color: "#f1f5f9", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column", paddingTop: 80 }}>
      {/* Fixed Zero-Jitter Master Control HUD */}
      <header style={{ background: "#020617", borderBottom: "1px solid #1e293b", padding: "16px", position: "sticky", top: 80, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#6366f1", letterSpacing: "0.05em" }}>SANGHAM Engine v2.0</span>
          <span style={{ fontSize: "0.75rem", background: "rgba(16, 185, 129, 0.1)", color: "#34d399", padding: "2px 8px", borderRadius: "9999px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>LIVE ENV</span>
        </div>
        
        {/* Instantaneous Hardware-Accelerated Switch Controls */}
        <div style={{ background: "#0f172a", padding: "4px", borderRadius: "12px", border: "1px solid #1e293b", display: "flex", gap: "4px" }}>
          {(["DONOR", "KIOSK", "NGO"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "-0.025em",
                transition: "all 150ms",
                cursor: "pointer",
                border: "none",
                ...(activeRole === role 
                  ? { background: "#4f46e5", color: "white", boxShadow: "0 4px 6px -1px rgba(79, 70, 229, 0.2)", transform: "scale(1)" } 
                  : { background: "transparent", color: "#94a3b8", transform: "scale(0.95)" })
              }}
              onMouseOver={(e) => {
                if (activeRole !== role) {
                  e.currentTarget.style.color = "#e2e8f0";
                  e.currentTarget.style.background = "rgba(30, 41, 59, 0.5)";
                }
              }}
              onMouseOut={(e) => {
                if (activeRole !== role) {
                  e.currentTarget.style.color = "#94a3b8";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {role} Space
            </button>
          ))}
        </div>
      </header>

      {/* Main Dynamic View Stage - Rendered with micro-second transition updates */}
      <main style={{ flex: 1, width: "100%", maxWidth: "1280px", margin: "0 auto", padding: "24px", transition: "opacity 200ms" }}>
        {activeRole === "DONOR" && <DonorDashboard />}
        {activeRole === "KIOSK" && <KioskDashboard />}
        {activeRole === "NGO" && <NgoDashboard />}
      </main>
    </div>
    </PortalProvider>
  );
}
