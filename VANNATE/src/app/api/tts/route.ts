import { NextResponse } from 'next/server';

async function fetchElevenLabs(text: string, voiceId = "EXAVITQu4vr4xnSDxMaL") {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ElevenLabs API key missing");

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "Accept": "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": apiKey
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.35, similarity_boost: 0.85, style: 0.1, use_speaker_boost: true }
    })
  });

  if (!res.ok) throw new Error("ElevenLabs API failed");
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('base64');
}

async function fetchSarvam(text: string, langCode: string, speaker: string = "ritu") {
  const apiKey = process.env.SARVAM_AI_API_KEY;
  if (!apiKey) throw new Error("Sarvam API key missing");

  const payload = {
    inputs: [text],
    target_language_code: langCode,
    speaker: speaker,
    pace: 1.0,
    model: "bulbul:v3"
  };

  const res = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-subscription-key": apiKey },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Sarvam Detailed Error:", errorText);
    throw new Error(`Sarvam API failed: ${errorText}`);
  }
  const data = await res.json();
  if (data.audios && data.audios.length > 0) return data.audios[0];
  throw new Error("No audio returned from Sarvam");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, target_language_code, speaker } = body;

    if (!text || !target_language_code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let base64Audio = "";
    const isEnglish = target_language_code.startsWith("en");
    const requestedSpeaker = speaker || "ritu";
    let provider = "fallback";

    const hasElevenLabs = !!process.env.ELEVENLABS_API_KEY;
    const hasSarvam = !!process.env.SARVAM_AI_API_KEY;

    if (isEnglish && hasElevenLabs) {
      try {
        base64Audio = await fetchElevenLabs(text);
        provider = "elevenlabs";
      } catch (e) {
        console.warn("ElevenLabs failed, trying Sarvam...", e);
        if (hasSarvam) {
          base64Audio = await fetchSarvam(text, target_language_code, requestedSpeaker);
          provider = "sarvam";
        } else {
          throw e;
        }
      }
    } else if (hasSarvam) {
      try {
        base64Audio = await fetchSarvam(text, target_language_code, requestedSpeaker);
        provider = "sarvam";
      } catch (e) {
        console.warn("Sarvam failed, trying ElevenLabs...", e);
        if (hasElevenLabs) {
          base64Audio = await fetchElevenLabs(text);
          provider = "elevenlabs";
        } else {
          throw e;
        }
      }
    } else {
      return NextResponse.json({ error: "No TTS providers configured. Please set ELEVENLABS_API_KEY or SARVAM_AI_API_KEY in .env", audios: [] }, { status: 200 });
    }

    return NextResponse.json({ audios: [base64Audio], provider });
  } catch (error: unknown) {
    console.error("TTS Proxy Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to generate TTS", audios: [] }, { status: 200 });
  }
}
