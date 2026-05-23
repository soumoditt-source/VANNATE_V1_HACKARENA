import { NextResponse } from "next/server";
import { performOCR } from "@/lib/ocr";

const supportedImages = ["image/png", "image/jpeg", "image/webp"];

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");

      if (!(file instanceof File)) {
        return NextResponse.json({ error: "Attach a file field named file." }, { status: 400 });
      }

      if (!supportedImages.includes(file.type)) {
        return NextResponse.json(
          { error: "Unsupported file type. Please upload a PNG, JPG, or WEBP image." },
          { status: 400 }
        );
      }

      const ocrText = await performOCR(file);
      
      return NextResponse.json({
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
        },
        pipeline: "ocr",
        status: "completed",
        verifiedExtraction: ocrText,
        nextAction: "OCR completed successfully! Text extracted and ready for verification.",
      });
    }

    return NextResponse.json({ error: "Invalid request format. Use multipart/form-data." }, { status: 400 });
  } catch (error: unknown) {
    console.error("Analyze Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process file" },
      { status: 500 }
    );
  }
}
