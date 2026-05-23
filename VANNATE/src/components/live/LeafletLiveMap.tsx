// @ts-nocheck
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LiveMarker } from "@/lib/live";

function createLiveIcon(severity: string, kind: string) {
  let color = "#14b8a6";
  if (severity === "critical" || kind === "incident") color = "#ef4444";
  if (severity === "high"     || kind === "blood")    color = "#f97316";
  if (kind === "shelter"      || kind === "ngo")      color = "#8b5cf6";

  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="${color}" stroke="#000" stroke-width="1">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="12" cy="12" r="4" fill="#000" opacity="0.5"/>
    </svg>`,
    className: "vannate-live-icon",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

export default function LeafletLiveMap({ markers }: { markers: LiveMarker[] }) {
  const center: [number, number] = [22.57, 88.36];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ width: "100%", height: "100%", backgroundColor: "#111" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com">CARTO</a>'
        />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={createLiveIcon(marker.severity, marker.kind)}
          >
            <Popup>
              <div style={{ color: "#000", padding: "4px", minWidth: 140 }}>
                <strong>{marker.label}</strong><br />
                <span style={{ fontSize: "0.82rem", color: "#555" }}>{marker.status}</span><br />
                <span style={{ fontSize: "0.82rem", fontWeight: "bold", color: "#8b5cf6" }}>
                  ETA: {marker.eta ?? "N/A"}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style>{`
        .vannate-live-icon { background: transparent !important; border: none !important; }
        .vannate-live-icon svg { animation: live-pulse 2s ease-in-out infinite; }
        @keyframes live-pulse {
          0%   { filter: drop-shadow(0 0 0px rgba(20,184,166,0.9)); transform: scale(0.9); }
          50%  { filter: drop-shadow(0 0 12px rgba(20,184,166,0.5)); transform: scale(1.1); }
          100% { filter: drop-shadow(0 0 0px rgba(20,184,166,0));   transform: scale(0.9); }
        }
        .leaflet-container { background: #111 !important; }
      `}</style>
    </div>
  );
}
