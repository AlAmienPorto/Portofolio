import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { put, list } from "@vercel/blob";

const DATA_PATH = path.join(process.cwd(), "src/data/portfolio-data.json");
const BLOB_JSON_NAME = "portfolio-data.json";

export async function GET() {
  try {
    let data;
    
    // Check if Vercel Blob is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Cari file JSON di Vercel Blob
      const { blobs } = await list({ prefix: BLOB_JSON_NAME, limit: 1 });
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url);
        if (response.ok) {
          data = await response.json();
        }
      }
    }
    
    // Fallback ke file lokal jika belum ada di Blob atau error
    if (!data) {
      const raw = await fs.readFile(DATA_PATH, "utf-8");
      data = JSON.parse(raw);
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error reading data:", error);
    return NextResponse.json({ success: false, error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the password field
    if (!body._auth || body._auth !== "jawad2026") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    // Remove auth from data before saving
    const { _auth, ...dataToSave } = body;
    const jsonString = JSON.stringify(dataToSave, null, 2);
    
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Simpan ke Vercel Blob (timpa file yang lama)
      await put(BLOB_JSON_NAME, jsonString, { 
        access: 'public', 
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json'
      });
    } else {
      // Save to local file (Fallback)
      await fs.writeFile(DATA_PATH, jsonString, "utf-8");
    }
    
    return NextResponse.json({ success: true, message: "Data saved successfully" });
  } catch (error: any) {
    console.error("Error saving data:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to save data" }, { status: 500 });
  }
}
