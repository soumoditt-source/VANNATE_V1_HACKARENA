import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;
    
    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}${file.type.startsWith('image') ? '.jpg' : file.type.startsWith('video') ? '.mp4' : '.bin'}`;
    const filePath = join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${uniqueName}`;
    return NextResponse.json({ url, success: true });
  } catch (error: unknown) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to upload file" }, { status: 500 });
  }
}
