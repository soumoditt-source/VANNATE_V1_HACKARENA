import { NextResponse } from "next/server";
import { activeDonation, type DonationRecord } from "@/lib/data";
import { generateHumanitarianIds } from "@/lib/id";

const donations: DonationRecord[] = [activeDonation];

export async function GET() {
  return NextResponse.json({
    donations,
    count: donations.length,
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    category?: string;
    amount?: number;
    ngo?: string;
    ngoCode?: string;
  };

  const ids = generateHumanitarianIds(body.ngoCode || "108");
  const donation: DonationRecord = {
    id: ids.donationId,
    donorId: ids.donorId,
    beneficiaryId: ids.beneficiaryId,
    ngoCode: ids.ngoCode,
    ngo: body.ngo || "Kolkata Relief Foundation",
    category: body.category || "Emergency Relief Kits",
    amount: Number(body.amount || 2500),
    trustToken: ids.trustToken,
    status: "initiated",
    impact: "New QR-backed donation created and ready for NGO acceptance.",
    eta: "52 minutes",
    route: [
      {
        label: "Donor scan",
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        status: "current",
        location: "Kolkata demo kiosk",
        proof: `QR generated for donor ${ids.donorId}.`,
      },
      {
        label: "NGO accepted",
        time: "Pending",
        status: "pending",
        location: "Partner NGO hub",
        proof: "Awaiting NGO scan.",
      },
      {
        label: "Beneficiary handoff",
        time: "Pending",
        status: "pending",
        location: "Assigned beneficiary zone",
        proof: "Awaiting beneficiary confirmation.",
      },
    ],
  };

  donations.unshift(donation);

  return NextResponse.json({ donation }, { status: 201 });
}
