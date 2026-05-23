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
  const hits = retrieveContext(message);

  // DEEP SEARCH INTERNET PROTOCOL
  let internetContext = "";
  if (message.toLowerCase().includes("news") || message.toLowerCase().includes("latest") || message.toLowerCase().includes("today")) {
    const newsApiKey = process.env.NEWS_API_KEY;
    if (newsApiKey) {
      try {
        const newsRes = await fetch(`https://newsapi.org/v2/everything?q=NGO OR humanitarian OR disaster&language=en&sortBy=publishedAt&pageSize=3&apiKey=${newsApiKey}`);
        const newsData = await newsRes.json();
        if (newsData.articles && newsData.articles.length > 0) {
          internetContext = "\n\nLIVE INTERNET SEARCH DATA:\n" + newsData.articles.map((a: any) => `- ${a.title}: ${a.description}`).join("\n");
        }
      } catch (e) {
        console.warn("Deep Search failed:", e);
      }
    }
  }

  const ragContext = hits.map((hit, index) => `[${index + 1}] ${hit.title}: ${hit.body}`).join("\n");

  const prompt = `You are Vanna, the intelligent humanitarian AI for the Vannate Trust Network.
You are assisting a ${role}. 
The user is speaking in ${language}. YOU MUST RESPOND ENTIRELY IN ${language}. Do not use English unless the user's language is English.
Maintain a professional, highly empathetic, and action-oriented tone.

${evidence ? `EVIDENCE EXTRACTED FROM UPLOADED DOCUMENT:\n${evidence}\n\n` : ""}
RELEVANT KNOWLEDGE BASE CONTEXT:
${ragContext}
${internetContext}

INSTRUCTIONS:
1. Greet the user naturally.
2. Directly answer their query using the provided context and internet search data.
3. If the answer is not in the context, use the live internet data or your general knowledge, but prioritize Vannate protocols.
4. Keep it concise, structural, and easy to read.

User Query: "${message}"`;

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
