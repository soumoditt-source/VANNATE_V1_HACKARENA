import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;
    
    if (!file) {
      return NextResponse.json({ error: "Missing audio file" }, { status: 400 });
    }

    const sarvamApiKey = process.env.SARVAM_AI_API_KEY;
    if (!sarvamApiKey) {
      return NextResponse.json({ error: "Sarvam AI API key not configured. Falling back to native browser speech recognition.", transcript: "Please use the native browser speech recognition." }, { status: 200 });
    }

    const sarvamFormData = new FormData();
    sarvamFormData.append('file', file);
    sarvamFormData.append('model', 'saaras:v3');

    const res = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: {
        "api-subscription-key": sarvamApiKey
      },
      body: sarvamFormData
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Sarvam API Error: ${errorText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("STT Proxy Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to process STT", transcript: "An error occurred while processing your request." }, { status: 200 });
  }
}
