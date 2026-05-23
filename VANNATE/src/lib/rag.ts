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

  // Natural greeting handling
  if (lower === "hi" || lower === "hello" || lower.includes("hello vanna")) {
    return "Namaskar! I am Vanna, your AI humanitarian assistant. I can help with donations, blood emergencies, NGO reports, crisis response, and translation. How can I serve humanity today?";
  }

  if (lower.includes("blood")) {
    return `For a blood emergency, I can identify the blood group, hospital radius, and eligibility window. I will show the nearest verified donor pool and trigger push alerts.`;
  }

  if (lower.includes("grant") || lower.includes("report") || lower.includes("proposal")) {
    return `I can help you draft a clean impact narrative with measurable KPIs, pulling directly from verified campaign data and donation logs to save you time.`;
  }

  if (lower.includes("fraud") || lower.includes("trust") || lower.includes("score")) {
    return `The Vannate Trust Score ranges from 0-1000 based on government registration, activity consistency, and media proof. Scores below 600 trigger a review to ensure absolute transparency.`;
  }

  if (lower.includes("disaster") || lower.includes("flood") || lower.includes("crisis")) {
    return `Activating Emergency Protocol: I am geofencing the crisis area to match nearby surplus and volunteers. What specific supplies do you need dispatched?`;
  }

  // Conversational fallback using RAG data naturally
  const bestHit = hits.length > 0 ? hits[0].body : "I am constantly learning new humanitarian protocols.";
  return `Based on my knowledge of the Vannate network: ${bestHit} Is there a specific crisis or NGO you'd like me to look into?`;
}

export async function generateWithOptionalOllama(prompt: string) {
  // First, check for Mistral API (Free tier cloud LLM) to enable true Multilingual Translation
  const mistralKey = process.env.MISTRAL_API_KEY;
  if (mistralKey) {
    try {
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${mistralKey}`,
        },
        body: JSON.stringify({
          model: "mistral-small-latest",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || null;
      }
    } catch (e) {
      console.warn("Mistral API failed, falling back to local...", e);
    }
  }

  // Fallback to local Ollama if Mistral is not configured or fails
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
