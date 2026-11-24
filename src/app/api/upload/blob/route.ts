import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdminRequest } from "@/lib/admin-auth";

/**
 * Issues short-lived tokens so the admin panel can upload large videos / audio straight
 * from the browser to Vercel Blob (bypassing the ~4.5 MB serverless body limit).
 */
export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Video upload needs Vercel Blob (BLOB_READ_WRITE_TOKEN)." }, { status: 503 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Only the logged-in admin may get an upload token.
        if (!(await isAdminRequest())) throw new Error("Unauthorized");
        return {
          allowedContentTypes: [
            "video/mp4", "video/webm", "video/quicktime",
            "audio/mpeg", "audio/mp3", "audio/mp4", "audio/x-m4a", "audio/aac", "audio/ogg", "audio/wav", "audio/x-wav", "audio/webm",
          ],
          maximumSizeInBytes: 200 * 1024 * 1024, // 200 MB
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 400 });
  }
}
