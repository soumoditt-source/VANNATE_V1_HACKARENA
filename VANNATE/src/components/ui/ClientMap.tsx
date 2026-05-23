// @ts-nocheck
"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { aStarRoute } from "@/lib/starRouter";
import { getConnectionQuality } from "@/lib/deviceCapability";

// Fix Leaflet default icon in Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

// ─── Geo Data ─────────────────────────────────────────────────────────────────
type GeoNode = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  dangerLevel: number;
  type: "ngo" | "hospital" | "bloodbank" | "crisis" | "checkpoint";
  description?: string;
};

const KOLKATA_NODES: GeoNode[] = [
  { id: "ngo1",    name: "Vannate NGO Hub — Salt Lake",  lat: 22.5726, lng: 88.3639, dangerLevel: 0.1, type: "ngo",       description: "Primary coordination center. 24/7 operations." },
  { id: "node2",   name: "Checkpoint Alpha — Howrah Br.",lat: 22.5800, lng: 88.3460, dangerLevel: 0.3, type: "checkpoint", description: "Supply convoy waypoint. Currently clear." },
  { id: "node3",   name: "Checkpoint Beta — Gariahat",   lat: 22.5186, lng: 88.3658, dangerLevel: 0.5, type: "checkpoint", description: "Moderate danger. Alternate route suggested." },
  { id: "node4",   name: "Relay Station — Dum Dum",      lat: 22.6396, lng: 88.4231, dangerLevel: 0.2, type: "checkpoint", description: "Secure relay. Airport logistics hub." },
  { id: "crisis1", name: "⚠ Crisis Zone — Sundarbans",   lat: 22.0154, lng: 88.7591, dangerLevel: 0.9, type: "crisis",     description: "CRITICAL: Cyclone aftermath. 847 affected. Immediate aid needed." },
  { id: "crisis2", name: "⚠ Flood Alert — Malda",        lat: 25.0108, lng: 88.1416, dangerLevel: 0.8, type: "crisis",     description: "HIGH: Flash flooding. 312 families displaced." },
  { id: "hosp1",   name: "SSKM Hospital",                lat: 22.5357, lng: 88.3428, dangerLevel: 0.0, type: "hospital",   description: "Major trauma center. Accepting critical cases." },
  { id: "hosp2",   name: "NRS Medical College",          lat: 22.5637, lng: 88.3666, dangerLevel: 0.0, type: "hospital",   description: "Blood transfusion unit active." },
  { id: "hosp3",   name: "Bellevue Clinic",              lat: 22.5462, lng: 88.3558, dangerLevel: 0.0, type: "hospital",   description: "Trauma care. 24h emergency." },
  { id: "blood1",  name: "Blood Bank — Kolkata",         lat: 22.5448, lng: 88.3426, dangerLevel: 0.0, type: "bloodbank",  description: "O- stock: 12 units. A+ stock: 45 units." },
  { id: "blood2",  name: "Regional Blood Bank — Howrah", lat: 22.6085, lng: 88.3028, dangerLevel: 0.0, type: "bloodbank",  description: "B- stock: 8 units. AB+ stock: 22 units." },
  { id: "ngo2",    name: "Red Cross — Kolkata Chapter",  lat: 22.5636, lng: 88.3512, dangerLevel: 0.0, type: "ngo",        description: "International partner. Verified VTS: 98." },
];

// ─── Icon Factory ──────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<string, { color: string; emoji: string; label: string }> = {
  ngo:        { color: "#8b5cf6", emoji: "🏛️", label: "NGO Hub" },
  hospital:   { color: "#14b8a6", emoji: "🏥", label: "Hospital" },
  bloodbank:  { color: "#ef4444", emoji: "🩸", label: "Blood Bank" },
  crisis:     { color: "#f97316", emoji: "⚠️", label: "Crisis Zone" },
  checkpoint: { color: "#f2ca50", emoji: "📍", label: "Checkpoint" },
  user:       { color: "#3b82f6", emoji: "🧑", label: "Your Location" },
};

function createIcon(type: string, pulse = false) {
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.checkpoint;
  return L.divIcon({
    html: `
      <div style="
        width:40px; height:40px; border-radius:50%;
        background:${cfg.color};
        display:flex; align-items:center; justify-content:center;
        font-size:18px; box-shadow: 0 0 0 3px ${cfg.color}44, 0 4px 12px #0009;
        ${pulse ? `animation: mapPulse 2s infinite;` : ""}
        border: 2px solid rgba(255,255,255,0.8);
      ">${cfg.emoji}</div>
      ${pulse ? `<style>@keyframes mapPulse { 0%,100%{box-shadow:0 0 0 3px ${cfg.color}44} 50%{box-shadow:0 0 0 10px ${cfg.color}22} }</style>` : ""}
    `,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24],
  });
}

// ─── Map Controller (fly-to) ───────────────────────────────────────────────────
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const prevCenter = useRef<[number, number]>(center);
  useEffect(() => {
    if (prevCenter.current[0] !== center[0] || prevCenter.current[1] !== center[1]) {
      map.flyTo(center, zoom, { duration: 1.5, easeLinearity: 0.25 });
      prevCenter.current = center;
    }
  }, [center, zoom, map]);
  return null;
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ClientMap() {
  const searchParams = useSearchParams();
  const highlightLat = searchParams?.get("lat");
  const highlightLng = searchParams?.get("lng");
  const highlightName = searchParams?.get("highlight");

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  // Use URL params for center if available, otherwise default
  const defaultCenter: [number, number] = highlightLat && highlightLng 
    ? [parseFloat(highlightLat), parseFloat(highlightLng)] 
    : [22.5726, 88.3639];
    
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [mapZoom, setMapZoom] = useState(highlightLat ? 16 : 10);
  const [route, setRoute] = useState<GeoNode[]>([]);
  const [predictedDemand, setPredictedDemand] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [mapType, setMapType] = useState<string>("standard");
  
  const tileConfigs = {
    standard: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community"
    },
    terrain: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }
  };
  
  const currentTile = tileConfigs[mapType as keyof typeof tileConfigs];

  // Combine static nodes with dynamic highlighted node
  const mapNodes = useMemo(() => {
    let nodes = [...KOLKATA_NODES];
    if (highlightLat && highlightLng && highlightName) {
      // Check if it already exists to avoid duplicates
      if (!nodes.find(n => n.name === highlightName)) {
         nodes.push({
           id: "dynamic-highlight",
           name: highlightName,
           lat: parseFloat(highlightLat),
           lng: parseFloat(highlightLng),
           dangerLevel: 0,
           type: "hospital",
           description: "Target destination for emergency response."
         });
      }
    }
    return nodes;
  }, [highlightLat, highlightLng, highlightName]);

  // Low-bandwidth tile switching
  useEffect(() => {
    const quality = getConnectionQuality();
    if (quality === "2g" || quality === "slow-2g") {
      setTileUrl("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    }
  }, []);

  // A* route: NGO Hub → Sundarbans Crisis
  useEffect(() => {
    const computed = aStarRoute(mapNodes, "ngo1", "crisis1");
    setRoute(computed);
  }, [mapNodes]);

  // Demand prediction
  useEffect(() => {
    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location: "crisis1", urgency: 0.9 }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.demand !== undefined) setPredictedDemand(data.demand); })
      .catch(() => {});
  }, []);

  // Auto-request geolocation on load
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          setMapCenter(coords);
          setMapZoom(12);
          setLocating(false);
          setLocationError(null);
        },
        (err) => {
          setLocating(false);
          setLocationError("Location access denied — showing Kolkata region");
        },
        { enableHighAccuracy: false, timeout: 8000 }
      );
    }
  }, []);

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setMapCenter(coords);
        setMapZoom(14);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setLocationError("Could not get your location.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  const filteredNodes = filter === "all"
    ? mapNodes
    : mapNodes.filter(n => n.type === filter);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "70vh", borderRadius: "20px", overflow: "hidden" }}>

      {/* Loading overlay */}
      {locating && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 1000,
          background: "rgba(5,5,15,0.85)", backdropFilter: "blur(8px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 12,
        }}>
          <div style={{
            width: 48, height: 48,
            border: "3px solid rgba(20,184,166,0.3)",
            borderTopColor: "#14b8a6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
          <div style={{ color: "#14b8a6", fontWeight: 700 }}>Acquiring GPS Signal...</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>Please allow location access in your browser</div>
        </div>
      )}

      {/* HUD Controls */}
      <div style={{
        position: "absolute", top: 14, left: 14, right: 14, zIndex: 999,
        display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center",
      }}>
        <button onClick={locateMe} style={{
          background: "rgba(15,23,42,0.92)", border: "1px solid rgba(20,184,166,0.5)",
          color: "#14b8a6", padding: "9px 16px", borderRadius: 10,
          cursor: "pointer", fontSize: "0.82rem", fontWeight: 700,
          backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: 6,
          boxShadow: "0 4px 20px #0008",
        }}>
          📍 {locating ? "Locating..." : "Locate Me"}
        </button>

        {/* Filter chips */}
        {["all", "crisis", "hospital", "bloodbank", "ngo"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            background: filter === f ? "rgba(20,184,166,0.25)" : "rgba(15,23,42,0.8)",
            border: `1px solid ${filter === f ? "#14b8a6" : "rgba(255,255,255,0.1)"}`,
            color: filter === f ? "#14b8a6" : "rgba(255,255,255,0.6)",
            padding: "8px 14px", borderRadius: 8, cursor: "pointer",
            fontSize: "0.75rem", fontWeight: 600, backdropFilter: "blur(10px)",
            textTransform: "capitalize",
          }}>
            {f === "all" ? "🗺 All" : f === "crisis" ? "⚠️ Crises" : f === "hospital" ? "🏥 Hospitals" : f === "bloodbank" ? "🩸 Blood Banks" : "🏛️ NGOs"}
          </button>
        ))}

        {/* Map Type Selector */}
        <div style={{ display: "flex", gap: 4, background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: 4, backdropFilter: "blur(10px)" }}>
          {[
            { id: "standard", label: "🗺️ Standard", color: "#14b8a6" },
            { id: "satellite", label: "🛰️ Satellite", color: "#8b5cf6" },
            { id: "terrain", label: "🏔️ Terrain", color: "#f59e0b" }
          ].map((type) => (
            <button 
              key={type.id} 
              onClick={() => setMapType(type.id)} 
              style={{
                background: mapType === type.id ? `${type.color}22` : "transparent",
                border: mapType === type.id ? `1px solid ${type.color}` : "1px solid transparent",
                color: mapType === type.id ? type.color : "rgba(255,255,255,0.6)",
                padding: "6px 10px", borderRadius: 6, cursor: "pointer",
                fontSize: "0.72rem", fontWeight: 600
              }}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div style={{
          marginLeft: "auto",
          background: "rgba(15,23,42,0.8)", border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.5)", padding: "8px 12px", borderRadius: 8,
          fontSize: "0.72rem", backdropFilter: "blur(10px)",
        }}>
          A* Engine Active • {mapNodes.length} nodes live
        </div>
      </div>

      {/* Location error banner */}
      {locationError && (
        <div style={{
          position: "absolute", top: 64, left: 14, zIndex: 998,
          background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)",
          color: "#f97316", padding: "8px 14px", borderRadius: 8, fontSize: "0.78rem",
          backdropFilter: "blur(10px)",
        }}>
          ⚠ {locationError}
        </div>
      )}

      {/* MAP */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ width: "100%", height: "100%", minHeight: "70vh", backgroundColor: "#0a0f1e" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <MapController center={mapCenter} zoom={mapZoom} />

        <TileLayer
          url={currentTile.url}
          attribution={currentTile.attribution}
        />

        {/* User location */}
        {userLocation && (
          <>
            <Marker position={userLocation} icon={createIcon("user", true)}>
              <Popup>
                <div style={{ minWidth: 160 }}>
                  <strong>📍 Your Live Location</strong>
                  <br />
                  <span style={{ fontSize: "0.78rem", color: "#555" }}>
                    {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                  </span>
                  <br />
                  <span style={{ fontSize: "0.75rem", color: "#14b8a6" }}>GPS Active</span>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={userLocation}
              radius={500}
              pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.08, weight: 1.5, dashArray: "6 4" }}
            />
          </>
        )}

        {/* A* route polyline */}
        {route.length > 1 && (
          <Polyline
            positions={route.map(n => [n.lat, n.lng] as [number, number])}
            pathOptions={{ color: "#14b8a6", opacity: 0.9, weight: 5, dashArray: "12 8" }}
          />
        )}

        {/* All crisis danger radius circles */}
        {filteredNodes.filter(n => n.type === "crisis").map(node => (
          <Circle
            key={`circle-${node.id}`}
            center={[node.lat, node.lng]}
            radius={15000}
            pathOptions={{ color: "#f97316", fillColor: "#f97316", fillOpacity: 0.08, weight: 1.5, dashArray: "6 4" }}
          />
        ))}

        {/* All map markers */}
        {filteredNodes.map(node => (
          <Marker
            key={node.id}
            position={[node.lat, node.lng]}
            icon={createIcon(node.type, node.type === "crisis")}
          >
            <Popup>
              <div style={{ padding: "4px", minWidth: 200 }}>
                <div style={{ fontWeight: 800, fontSize: "0.9rem", marginBottom: 4, color: "#111" }}>
                  {node.name}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#555", marginBottom: 6, lineHeight: 1.4 }}>
                  {node.description}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{
                    padding: "2px 8px", background: TYPE_CONFIG[node.type]?.color,
                    color: "#fff", borderRadius: 4, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
                  }}>
                    {TYPE_CONFIG[node.type]?.label}
                  </span>
                  {node.dangerLevel > 0 && (
                    <span style={{
                      padding: "2px 8px",
                      background: node.dangerLevel > 0.7 ? "#ef444422" : "#f9731622",
                      color: node.dangerLevel > 0.7 ? "#ef4444" : "#f97316",
                      borderRadius: 4, fontSize: "0.7rem", fontWeight: 700,
                    }}>
                      Danger {Math.round(node.dangerLevel * 100)}%
                    </span>
                  )}
                </div>
                {node.id === "crisis1" && predictedDemand !== null && (
                  <div style={{ marginTop: 8, padding: "6px 8px", background: "#fef2f2", borderRadius: 6, fontSize: "0.78rem", color: "#b91c1c", fontWeight: 700 }}>
                    🤖 AI Predicts: {predictedDemand} relief units needed
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div style={{
        position: "absolute", bottom: 14, right: 14, zIndex: 999,
        background: "rgba(5,10,20,0.9)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12, padding: "12px 16px",
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        {Object.entries(TYPE_CONFIG).filter(([k]) => k !== "user").map(([key, cfg]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
            {cfg.label}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .leaflet-container { background: #0a0f1e !important; }
        .leaflet-popup-content-wrapper { border-radius: 12px !important; box-shadow: 0 8px 32px #0006 !important; }
        .leaflet-popup-tip { display: none; }
      `}</style>
    </div>
  );
}
