import { NextResponse } from "next/server";
import { liveMarkers } from "@/lib/live";

const donors = [
  { id: "DON-001", name: "Sanjay Mehta", group: "O-", eligible: true, lastDonated: "2026-03-10", dist: "1.2 km", lat: 22.5687, lng: 88.3568 },
  { id: "DON-002", name: "Ananya Sen", group: "O-", eligible: true, lastDonated: "2026-01-22", dist: "2.8 km", lat: 22.5815, lng: 88.3642 },
  { id: "DON-003", name: "Monika Das", group: "AB-", eligible: true, lastDonated: "2026-02-15", dist: "4.5 km", lat: 22.5431, lng: 88.3424 },
  { id: "DON-004", name: "Rahul Bose", group: "B-", eligible: false, lastDonated: "2026-04-01", dist: "3.1 km", lat: 22.5998, lng: 88.3881 },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const group = searchParams.get("group") ?? "";
  const filtered = group ? donors.filter((donor) => donor.group.toLowerCase() === group.toLowerCase()) : donors;

  return NextResponse.json({
    donors: filtered,
    total: filtered.length,
    mapMarkers: liveMarkers.filter((marker) => ["hospital", "donor", "blood"].includes(marker.kind)),
    provider: "openstreetmap-ready",
  });
}

export async function POST(req: Request) {
  const body = await req.json() as { group?: string; units?: number; hospital?: string; lat?: number; lng?: number };
  const group = body.group ?? "O-";
  const eligible = donors.filter((donor) => donor.group === group && donor.eligible);

  return NextResponse.json({
    alert: {
      id: `BLD-${Date.now()}`,
      group,
      units: body.units ?? 1,
      hospital: body.hospital ?? "Demo partner hospital",
      status: "alerted",
      eta: eligible.length > 0 ? "12-20 minutes" : "manual escalation required",
      eligibleDonors: eligible.length,
      map: {
        lat: body.lat ?? 22.5745,
        lng: body.lng ?? 88.3639,
        provider: "OpenStreetMap fallback; connect OpenRouteService for live ETA.",
      },
    },
  }, { status: 201 });
}
