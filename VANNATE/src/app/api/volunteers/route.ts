 import { NextResponse } from "next/server";
const volunteers = [
  { id: "VOL-001", name: "Riya Chatterjee", skill: "Medical First Aid", zone: "South Kolkata", status: "available", rating: 4.9, tasks: 28 },
  { id: "VOL-002", name: "Arjun Das", skill: "Logistics", zone: "Howrah", status: "available", rating: 4.7, tasks: 42 },
  { id: "VOL-003", name: "Priya Nair", skill: "Translation", zone: "Salt Lake", status: "on-task", rating: 4.8, tasks: 15 },
];
export async function GET() {
  return NextResponse.json({ volunteers, total: volunteers.length, available: volunteers.filter(v => v.status === "available").length });
}
export async function POST(req: Request) {
  const body = await req.json() as { volunteerId?: string; taskId?: string; zone?: string };
  return NextResponse.json({ dispatch: { id: `DSP-${Date.now()}`, volunteerId: body.volunteerId, taskId: body.taskId, zone: body.zone, status: "dispatched", eta: "8-15 minutes" } }, { status: 201 });
}