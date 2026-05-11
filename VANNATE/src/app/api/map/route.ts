import { NextResponse } from "next/server";
import { liveApiCatalog, liveMarkers } from "@/lib/live";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const layer = searchParams.get("layer") ?? "all";
  const markers = liveMarkers.filter((marker) => {
    if (layer === "all") return true;
    if (layer === "blood") return ["blood", "hospital", "donor"].includes(marker.kind);
    if (layer === "incident") return ["incident", "shelter", "volunteer"].includes(marker.kind);
    return marker.kind === layer;
  });

  return NextResponse.json({
    provider: "openstreetmap-ready",
    layer,
    center: { lat: 22.5726, lng: 88.3639, label: "Kolkata command center" },
    markers,
    connect: liveApiCatalog.filter((api) =>
      api.need.toLowerCase().includes("map") ||
      api.need.toLowerCase().includes("routing") ||
      api.need.toLowerCase().includes("geocoding")
    ),
  });
}
