import { NextResponse } from "next/server";
import type { FeedbackRecord } from "@/lib/data";

const feedback: FeedbackRecord[] = [];

export async function GET() {
  const positive = feedback.filter((item) => item.rating === 1).length;
  const negative = feedback.filter((item) => item.rating === -1).length;

  return NextResponse.json({
    total: feedback.length,
    positive,
    negative,
    rewardSignal: feedback.length === 0 ? 0 : Number((positive / feedback.length).toFixed(2)),
    dataset: feedback.slice(0, 20),
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    message?: string;
    rating?: 1 | -1;
    correction?: string;
  };

  const record: FeedbackRecord = {
    id: crypto.randomUUID(),
    message: body.message || "No message supplied",
    rating: body.rating === -1 ? -1 : 1,
    correction: body.correction,
    createdAt: new Date().toISOString(),
  };

  feedback.unshift(record);

  return NextResponse.json({
    saved: true,
    record,
    nextTrainingStep:
      "Export this preference dataset for retrieval tuning, prompt evals, and future reward-model experiments.",
  });
}
