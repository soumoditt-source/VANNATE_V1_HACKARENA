"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PackageSearch, Send, MapPin, CheckCircle } from "lucide-react";

// Dynamically import map to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false });

import { usePortalContext } from "@/components/dashboards/PortalContext";

export default function KioskDashboard() {
  const { donations, kioskScans, updateKioskScan } = usePortalContext();
  const [isClient, setIsClient] = useState(false);
  const [activeDonationId, setActiveDonationId] = useState<string>("");

  const activeScan = kioskScans.find(s => s.donationId === activeDonationId);
  const step = activeScan ? activeScan.currentStep : 0;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkpoints = [
    { name: "Kiosk Alpha (Collection)", coords: [19.0760, 72.8777] as [number, number] },
    { name: "In Transit (Hub Central)", coords: [19.0850, 72.8900] as [number, number] },
    { name: "NGO Warehouse (Received)", coords: [19.1000, 72.9000] as [number, number] }
  ];

  const handleScan = () => {
    if (!activeDonationId) {
      alert("Please select a donation package to scan first!");
      return;
    }
    if (step < 2) {
      updateKioskScan({
        donationId: activeDonationId,
        currentStep: step + 1,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "2rem" }}>
      
      {/* LEFT COL: Operations */}
      <div style={{ background: "#0f172a", padding: "2rem", borderRadius: "16px", border: "1px solid #1e293b" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <PackageSearch className="text-amber-400" />
          Kiosk Asset Scanner
        </h2>

        <div style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "12px", textAlign: "center", marginBottom: "2rem" }}>
          <select 
            value={activeDonationId} 
            onChange={e => setActiveDonationId(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#fff", marginBottom: "1rem" }}
          >
            <option value="">-- Select Pending Package to Scan --</option>
            {donations.map(d => (
              <option key={d.id} value={d.id}>{d.id} ({d.donorName} - ₹{d.baseAmount})</option>
            ))}
          </select>
          
          <div style={{ width: "100px", height: "100px", border: "2px dashed #475569", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>[ CAMERA FEED ]</span>
          </div>
          <button 
            onClick={handleScan}
            disabled={step === 2 || !activeDonationId}
            style={{ 
              background: step === 2 ? "#334155" : "#f59e0b", 
              color: "#fff", 
              padding: "12px 24px", 
              borderRadius: "8px", 
              fontWeight: 600, 
              border: "none", 
              cursor: (step === 2 || !activeDonationId) ? "default" : "pointer",
              width: "100%",
              transition: "all 0.2s"
            }}
          >
            {step === 0 ? "Scan New Package" : step === 1 ? "Update Transit Status" : "Asset Fully Delivered"}
          </button>
        </div>

        <div>
          <h3 style={{ fontSize: "1rem", color: "#94a3b8", marginBottom: "1rem" }}>Active Logistics Ledger</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {checkpoints.map((cp, idx) => {
              const active = idx === step;
              const completed = idx < step;
              return (
                <div key={cp.name} style={{ display: "flex", gap: "1rem", opacity: completed || active ? 1 : 0.4 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: completed ? "#10b981" : active ? "#f59e0b" : "#334155", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                      {completed ? <CheckCircle size={14} /> : idx + 1}
                    </div>
                    {idx < 2 && <div style={{ width: "2px", height: "30px", background: completed ? "#10b981" : "#334155", margin: "4px 0" }} />}
                  </div>
                  <div style={{ paddingTop: "2px" }}>
                    <div style={{ fontWeight: 600, color: active ? "#f59e0b" : "#fff" }}>{cp.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{completed ? "Completed" : active ? "Current Location" : "Pending"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COL: Map */}
      <div style={{ background: "#0f172a", borderRadius: "16px", border: "1px solid #1e293b", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: "10px" }}>
          <MapPin className="text-rose-400" />
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Real-Time Route Map</h2>
        </div>
        
        <div style={{ flex: 1, minHeight: "400px", background: "#1e293b" }}>
          {isClient && (
            <MapContainer 
              center={checkpoints[1].coords} 
              zoom={12} 
              style={{ height: "100%", width: "100%", zIndex: 10 }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">Carto</a>'
              />
              <Polyline positions={checkpoints.map(c => c.coords)} color="#3b82f6" weight={3} dashArray="5, 10" />
              
              {checkpoints.map((cp, idx) => (
                <Marker key={idx} position={cp.coords} opacity={idx <= step ? 1 : 0.5} />
              ))}
            </MapContainer>
          )}
        </div>
      </div>

    </div>
  );
}
