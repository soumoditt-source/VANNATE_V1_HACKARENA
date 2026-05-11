 import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    liveBeneficiaries: 124381,
    aidDisbursed: 84000000,
    verifiedNGOs: 317,
    fraudPrevented: 2400000,
    volunteerHours: 42800,
    deliveryRate: 0.992,
    sdgMapping: [
      { sdg: 1, label: "No Poverty", pct: 78 },
      { sdg: 2, label: "Zero Hunger", pct: 65 },
      { sdg: 3, label: "Good Health", pct: 82 },
      { sdg: 6, label: "Clean Water", pct: 71 },
    ],
    monthlyAid: [42,58,71,65,88,94,108,124,138,119,142,156],
  });
}