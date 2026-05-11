import { knowledgeBase, type KnowledgeDoc } from "@/lib/data";

type RetrievalHit = KnowledgeDoc & { score: number };

const stopWords = new Set([
  "the",
  "is",
  "a",
  "an",
  "and",
  "or",
  "to",
  "of",
  "for",
  "with",
  "in",
  "on",
  "my",
  "our",
  "how",
  "can",
  "we",
  "what",
  "where",
  "need",
  "please",
]);

function tokenize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function scoreDoc(queryTokens: string[], doc: KnowledgeDoc) {
  const haystack = `${doc.title} ${doc.tags.join(" ")} ${doc.body}`.toLowerCase();
  return queryTokens.reduce((score, token) => {
    const titleBoost = doc.title.toLowerCase().includes(token) ? 3 : 0;
    const tagBoost = doc.tags.some((tag) => tag.toLowerCase().includes(token)) ? 2 : 0;
    const bodyBoost = haystack.includes(token) ? 1 : 0;
    return score + titleBoost + tagBoost + bodyBoost;
  }, 0);
}

export function retrieveContext(query: string, topK = 4): RetrievalHit[] {
  const tokens = tokenize(query);
  const scored = knowledgeBase
    .map((doc) => ({ ...doc, score: scoreDoc(tokens, doc) }))
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored.length > 0
    ? scored
    : knowledgeBase.slice(0, topK).map((doc, index) => ({ ...doc, score: topK - index }));
}

export function buildLocalAnswer(message: string, role: string, hits: RetrievalHit[]) {
  const lower = message.toLowerCase();
  const sourceLine = hits.map((hit) => hit.title).join(", ");

  if (lower.includes("blood")) {
    return `For a blood emergency, Vannate should first identify the blood group, hospital, radius, and eligibility window. The MVP can show the nearest verified donor pool, trigger emergency push alerts, and create a hospital-confirmed request ID. Based on the retrieved context, prioritize rare groups, route by distance, and log every response with beneficiary-safe privacy controls. Sources used: ${sourceLine}.`;
  }

  if (lower.includes("grant") || lower.includes("report") || lower.includes("proposal")) {
    return `For NGO automation, create the report from verified campaign data, donation logs, volunteer attendance, beneficiary confirmations, and media proof. The copilot should draft a clean impact narrative, add measurable KPIs, cite source records, and flag missing compliance data instead of inventing it. This is where Vannate returns 10+ hours per week to NGOs. Sources used: ${sourceLine}.`;
  }

  if (lower.includes("fraud") || lower.includes("trust") || lower.includes("score")) {
    return `Use the Vannate Trust Score as the visible trust layer: government registration, activity consistency, beneficiary confirmation, media proof quality, reviews, and anomaly resistance combine into a 0-1000 score. Below 600 routes to review; below 400 suspends until human moderation. Sources used: ${sourceLine}.`;
  }

  if (lower.includes("disaster") || lower.includes("flood") || lower.includes("crisis")) {
    return `Activate Emergency Command Center: geofence the crisis, rank needs by severity, match nearby surplus and volunteers, display route proof, and forecast shortages for the next 24 hours. For the Kolkata demo, Howrah Sector 4 is the strongest live scenario because the deck already contains flood, water, doctors, food kits, tarpaulin, and insulin shortage signals. Sources used: ${sourceLine}.`;
  }

  if (lower.includes("api") || lower.includes("deploy") || lower.includes("free")) {
    return `The prototype is free-by-default: Next.js fullstack routes, local RAG, browser voice, optional Ollama, and static map visuals. Add Supabase/Neon for persistence, Qdrant for vector search, Firebase for notifications, Resend for email, Razorpay/Stripe test mode for payments, and Mapbox/Google only if you receive keys. Sources used: ${sourceLine}.`;
  }

  return `Vannate should answer this through a trust-first humanitarian workflow: identify the actor, retrieve verified context, create a QR-backed record, attach geo/time proof, route the task to the right AI agent, and collect human feedback for RLHF. For the ${role} view, the most relevant retrieved context is: ${hits.map((hit) => hit.body).join(" ")}`;
}

export async function generateWithOptionalOllama(prompt: string) {
  const baseUrl = process.env.OLLAMA_BASE_URL;
  const model = process.env.OLLAMA_MODEL || "llama3.1";

  if (!baseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, stream: false }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { response?: string };
    return data.response?.trim() || null;
  } catch {
    return null;
  }
}
