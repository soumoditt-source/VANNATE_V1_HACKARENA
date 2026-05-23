import { Metadata } from "next";
import DynamicMap from "@/components/ui/DynamicMap";
import LiveNewsFeed from "@/components/ui/LiveNewsFeed";

export const metadata: Metadata = {
  title: "Crisis Response | Vannate AI",
  description: "Live geospatial routing and ML demand prediction.",
};

export default function CrisisPage() {
  return (
    <div style={{ minHeight: "100vh", padding: "100px 5vw 50px" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontFamily: "var(--font-playfair)", fontWeight: 900 }}>
          Live Crisis Intelligence
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "800px", marginTop: "1rem" }}>
          The A* pathfinding algorithm is currently calculating the safest route for incoming supply convoys, avoiding flooded areas in real-time. Our TensorFlow.js model is simultaneously predicting demand surges.
        </p>
      </header>

      {/* Map — must have explicit height or Leaflet renders as 0px */}
      <div style={{ width: "100%", height: "72vh", borderRadius: "20px", overflow: "hidden", marginBottom: "3rem", border: "1px solid rgba(255,255,255,0.08)" }}>
        <DynamicMap />
      </div>


      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginTop: "3rem" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", padding: "2rem", borderRadius: "20px" }}>
          <h3 style={{ color: "var(--teal)", marginBottom: "1rem", fontSize: "1.2rem" }}>A* Hybrid Routing Engine</h3>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            Traditional GPS uses Dijkstra's algorithm to find the shortest path. Vannate uses A* with a dynamic heuristic multiplier—if a node reports flooding (Danger Level: 0.8), the algorithm automatically reroutes trucks around the hazard zone.
          </p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", padding: "2rem", borderRadius: "20px" }}>
          <h3 style={{ color: "var(--teal)", marginBottom: "1rem", fontSize: "1.2rem" }}>TensorFlow.js Demand Prediction</h3>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6 }}>
            Our 3-layer Dense Neural Network runs directly in the browser. It analyzes crisis severity, time of day, and location coordinates to predict exactly how many emergency rations will be required before the crisis peaks.
          </p>
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <LiveNewsFeed />
        </div>
      </div>
    </div>
  );
}
