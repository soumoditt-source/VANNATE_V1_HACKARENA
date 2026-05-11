import { NextResponse } from "next/server";
import { activeDonation } from "@/lib/data";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  return NextResponse.json({
    id,
    donation: activeDonation,
    live: {
      latitude: 22.5656,
      longitude: 88.3425,
      speedKmph: 22,
      etaMinutes: 34,
      routeCompletion: 58,
      currentCheckpoint: "Vidyasagar Setu corridor",
      nextCheckpoint: "Howrah Sector 4 shelter",
    },
  });
}
