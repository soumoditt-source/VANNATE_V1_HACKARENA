import { liveMarkers, type LiveMarker } from "@/lib/live";

type LiveMapProps = {
  title: string;
  layer?: "all" | "blood" | "incident";
  markers?: LiveMarker[];
};

function markerPosition(marker: LiveMarker) {
  const minLat = 22.52;
  const maxLat = 22.62;
  const minLng = 88.24;
  const maxLng = 88.44;
  const x = ((marker.lng - minLng) / (maxLng - minLng)) * 100;
  const y = 100 - ((marker.lat - minLat) / (maxLat - minLat)) * 100;

  return {
    left: `${Math.min(92, Math.max(6, x))}%`,
    top: `${Math.min(88, Math.max(10, y))}%`,
  };
}

function matchesLayer(marker: LiveMarker, layer: LiveMapProps["layer"]) {
  if (!layer || layer === "all") return true;
  if (layer === "incident") return marker.kind === "incident" || marker.kind === "shelter" || marker.kind === "volunteer";
  return marker.kind === "blood" || marker.kind === "hospital" || marker.kind === "donor";
}

export default function LiveMap({ title, layer = "all", markers = liveMarkers }: LiveMapProps) {
  const visibleMarkers = markers.filter((marker) => matchesLayer(marker, layer));

  return (
    <div className="live-map-shell">
      <div className="live-map-head">
        <div>
          <h3>{title}</h3>
          <p>OpenStreetMap-ready feed. Connect routing keys later; demo coordinates work now.</p>
        </div>
        <span className="live-pill">LIVE API READY</span>
      </div>
      <div className="live-map-canvas" aria-label={`${title} live map`}>
        <div className="live-map-tiles" />
        <div className="live-map-route" />
        {visibleMarkers.map((marker) => (
          <div
            key={marker.id}
            className={`live-marker ${marker.severity} ${marker.kind}`}
            style={markerPosition(marker)}
            title={`${marker.label} - ${marker.status}`}
          >
            <span />
            <strong>{marker.label}</strong>
            <em>{marker.eta ?? marker.status}</em>
          </div>
        ))}
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
