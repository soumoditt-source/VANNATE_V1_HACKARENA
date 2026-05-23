export async function performOCR(file: File | Blob): Promise<string> {
  const formData = new FormData();
  formData.append("apikey", "K84303707788957");
  formData.append("file", file);
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");

  try {
    const res = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) {
      throw new Error(`OCR API failed with status ${res.status}`);
    }

    const data = await res.json();
    
    if (data.IsErroredOnProcessing) {
      throw new Error(data.ErrorMessage?.[0] || "Unknown OCR Error");
    }

    if (data.ParsedResults && data.ParsedResults.length > 0) {
      return data.ParsedResults[0].ParsedText;
    }
    
    return "";
  } catch (err) {
    console.error("OCR Error:", err);
    throw err;
  }
}
