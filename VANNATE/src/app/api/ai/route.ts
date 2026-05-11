import { NextResponse } from "next/server";
import { buildLocalAnswer, generateWithOptionalOllama, retrieveContext } from "@/lib/rag";
import { copilotReasoningSteps } from "@/lib/live";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    message?: string;
    role?: string;
    language?: string;
    evidence?: string;
    mode?: string;
  };

  const message = body.message?.trim() || "Explain Vannate";
  const role = body.role || "donor";
  const language = body.language || "English";
  const evidence = body.evidence?.trim();
  const hits = retrieveContext(`${message} ${evidence ?? ""}`);

  const prompt = [
    "You are Vannate-Humanity-1, a concise humanitarian AI copilot.",
    "Do not invent compliance claims. Cite retrieved context names.",
    "Use the public 8-step checklist for auditability. Never expose private chain-of-thought.",
    "Return verified facts, assumptions, missing data, and next actions only.",
    `Current user role: ${role}. Preferred language: ${language}.`,
    `Current mode: ${body.mode ?? "not specified"}.`,
    evidence ? `Verified user evidence: ${evidence}` : "Verified user evidence: none provided.",
    "Retrieved context:",
    ...hits.map((hit) => `- ${hit.title} (${hit.source}): ${hit.body}`),
    `User: ${message}`,
    "Answer in 140 words with citations and one concrete next action.",
  ].join("\n");

  const ollamaAnswer = await generateWithOptionalOllama(prompt);
  const answer = ollamaAnswer || buildLocalAnswer(message, role, hits);

  return NextResponse.json({
    answer,
    provider: ollamaAnswer ? "ollama-local" : "local-rag",
    citations: hits.map((hit) => ({
      id: hit.id,
      title: hit.title,
      source: hit.source,
      score: hit.score,
    })),
    reasoning: {
      mode: "auditable-8-step",
      steps: copilotReasoningSteps,
      visibleSummary:
        "The copilot retrieves context, checks evidence, states missing data, and gives cited next actions. It does not claim OCR/audio/video findings unless an extractor returns verified text.",
    },
    rlhf: {
      instruction: "Use thumbs up/down in the UI to store reviewer preference data.",
      status: "feedback-ready",
    },
  });
}
