"use client";
import dynamic from "next/dynamic";

const ClientMap = dynamic(() => import("@/components/ui/ClientMap"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: "100%", height: "100%", minHeight: "70vh",
      background: "linear-gradient(135deg, #0a0f1e 0%, #111827 100%)",
      borderRadius: "20px",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
      border: "1px solid rgba(20,184,166,0.15)"
    }}>
      <div style={{
        width: 48, height: 48,
        border: "3px solid rgba(20,184,166,0.3)",
        borderTopColor: "#14b8a6",
        borderRadius: "50%",
        animation: "spin 0.9s linear infinite"
      }} />
      <div style={{ color: "#14b8a6", fontWeight: 700, letterSpacing: "2px", fontSize: "0.85rem" }}>
        INITIALIZING GEOLOCATION ENGINE
      </div>
      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>
        Loading crisis nodes & A* routing...
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )
});

export default function DynamicMap(props: Record<string, unknown>) {
  return <ClientMap {...props} />;
}
