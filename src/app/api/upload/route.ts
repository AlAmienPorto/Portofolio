import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { isAdminRequest } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return NextResponse.json({ success: false, error: "No file" }, { status: 400 });

    // Only images, video and PDF (resume) — nothing executable like .html/.svg
    const ALLOWED: Record<string, string> = {
      "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif",
      "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov",
      "application/pdf": "pdf",
    };
    const ext = ALLOWED[file.type];
    if (!ext) {
      return NextResponse.json({ success: false, error: `File type not allowed: ${file.type || "unknown"}` }, { status: 415 });
    }
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File too large (max 50 MB)" }, { status: 413 });
    }

    const filename = `upload_${Date.now()}.${ext}`;

    // Check if Vercel Blob is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Upload to Vercel Blob
      const blob = await put(filename, file, { access: 'public' });
      return NextResponse.json({ success: true, url: blob.url });
    } else {
      // Fallback to local upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public/uploads");
      
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, filename), buffer);

      return NextResponse.json({ success: true, url: `/uploads/${filename}` });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
