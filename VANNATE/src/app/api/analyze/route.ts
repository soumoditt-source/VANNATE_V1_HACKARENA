import { NextResponse } from "next/server";
import { copilotReasoningSteps, liveApiCatalog } from "@/lib/live";

const supported = {
  image: ["image/png", "image/jpeg", "image/webp", "application/pdf"],
  audio: ["audio/mpeg", "audio/mp4", "audio/wav", "audio/webm", "audio/ogg"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
};

function classify(contentType: string) {
  if (supported.image.includes(contentType)) return "ocr";
  if (supported.audio.includes(contentType)) return "audio-transcription";
  if (supported.video.includes(contentType)) return "mp4-video-analysis";
  return "unknown";
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Attach a file field named file." }, { status: 400 });
    }

    const pipeline = classify(file.type);
    const providers = liveApiCatalog.filter((item) =>
      item.need === "OCR" ||
      item.need === "Audio transcription" ||
      item.need === "MP4 incident analysis" ||
      item.need === "RAG vector search" ||
      item.need === "Local or hosted reasoning LLM"
    );

    return NextResponse.json({
      file: {
        name: file.name,
        type: file.type || "unknown",
        size: file.size,
      },
      pipeline,
      status: pipeline === "unknown" ? "needs-supported-file" : "ready-to-process",
      verifiedExtraction: null,
      noHallucinationRule:
        "No OCR, speech transcript, or video scene claim is returned until a real extractor provider supplies text or frames.",
      reasoning: copilotReasoningSteps,
      providers,
      nextAction:
        pipeline === "ocr"
          ? "Connect Tesseract local or Mistral OCR, then store extracted text as RAG evidence."
          : pipeline === "audio-transcription"
            ? "Connect faster-whisper, then store transcript with timestamp and language."
            : pipeline === "mp4-video-analysis"
              ? "Connect ffmpeg frame extraction and a local vision model, then cite frame timestamps."
              : "Upload PNG, JPG, PDF, WAV, MP3, WEBM, MOV, or MP4.",
    });
  }

  const body = (await request.json().catch(() => ({}))) as { text?: string; modality?: string };

  return NextResponse.json({
    modality: body.modality ?? "text",
    verifiedExtraction: body.text ?? "",
    reasoning: copilotReasoningSteps,
    nextAction: "Text evidence accepted. Send it to /api/ai with mode and role for cited RAG response.",
  });
}
