import { NextResponse } from "next/server";
import { generateUserIdentity, type AccountMode } from "@/lib/id";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    mode?: AccountMode;
  };
  const identity = generateUserIdentity(body.mode ?? "citizen", body.name ?? "Vannate User");

  return NextResponse.json({
    user: {
      name: body.name ?? "Vannate User",
      mode: body.mode ?? "citizen",
      ...identity,
    },
    storageNote: "Persist this record in Supabase users and qr_identities tables for production.",
  }, { status: 201 });
}
