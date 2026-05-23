"use client";

import dynamic from "next/dynamic";
import { liveMarkers, type LiveMarker } from "@/lib/live";
import { useEffect, useState } from "react";

// Dynamically import Leaflet so it doesn't crash on SSR
const LeafletLiveMap = dynamic(() => import("./LeafletLiveMap"), { ssr: false, loading: () => <div className="live-map-canvas" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>Loading Live Radar...</div> });

type LiveMapProps = {
  title: string;
  layer?: "all" | "blood" | "incident";
  markers?: LiveMarker[];
};

function matchesLayer(marker: LiveMarker, layer: LiveMapProps["layer"]) {
  if (!layer || layer === "all") return true;
  if (layer === "incident") return marker.kind === "incident" || marker.kind === "shelter" || marker.kind === "volunteer";
  return marker.kind === "blood" || marker.kind === "hospital" || marker.kind === "donor";
}

export default function LiveMap({ title, layer = "all", markers = liveMarkers }: LiveMapProps) {
  const [mounted, setMounted] = useState(false);
  const visibleMarkers = markers.filter((marker) => matchesLayer(marker, layer));

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="live-map-shell">
      <div className="live-map-head">
        <div>
          <h3>{title}</h3>
          <p>Leaflet Engine Active • Live OpenStreetMap Overlay</p>
        </div>
        <span className="live-pill" style={{ background: "rgba(20, 184, 166, 0.2)", color: "var(--teal)", border: "1px solid var(--teal)" }}>
          LIVE RADAR
        </span>
      </div>
      
      {/* Map Container */}
      <div style={{ width: "100%", height: "400px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
        {mounted && <LeafletLiveMap markers={visibleMarkers} />}
      </div>

      <div className="live-map-feed">
        {visibleMarkers.map((marker) => (
          <div key={marker.id}>
            <span className={`feed-dot ${marker.severity}`} />
            <strong>{marker.zone}</strong>
            <small>{marker.status}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
