import { NextResponse } from "next/server";
import { liveMarkers } from "@/lib/live";

export async function GET() {
  return NextResponse.json({
    activeZones: [
      { id: "CRZ-001", type: "Flood", zone: "Howrah Sector 4", severity: "critical", affected: 1240, lat: 22.5958, lng: 88.2636 },
      { id: "CRZ-002", type: "Power Outage", zone: "Salt Lake Block C", severity: "high", affected: 420, lat: 22.5766, lng: 88.4241 },
    ],
    mapMarkers: liveMarkers.filter((marker) => ["incident", "shelter", "volunteer"].includes(marker.kind)),
    totalAffected: 1660,
    activeResponders: 28,
    provider: "openstreetmap-ready",
  });
}

export async function POST(req: Request) {
  const body = await req.json() as { type?: string; zone?: string; severity?: string; affected?: number; lat?: number; lng?: number; evidenceId?: string };

  return NextResponse.json({
    emergency: {
      id: `EMG-${Date.now()}`,
      type: body.type ?? "Unknown",
      zone: body.zone ?? "Unknown",
      severity: body.severity ?? "high",
      affected: body.affected ?? 0,
      lat: body.lat ?? 22.5958,
      lng: body.lng ?? 88.2636,
      status: "activated",
      activatedAt: new Date().toISOString(),
      dispatchPlan: ["verify source", "geocode zone", "alert volunteers", "rank needs", "route relief", "monitor closure"],
      evidenceId: body.evidenceId ?? null,
    },
  }, { status: 201 });
}
