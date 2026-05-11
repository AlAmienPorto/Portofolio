import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/portfolio-data.json");

export async function GET() {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json({ success: true, data });
  } catch (error) {
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
    
    await fs.writeFile(DATA_PATH, JSON.stringify(dataToSave, null, 2), "utf-8");
    return NextResponse.json({ success: true, message: "Data saved successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 });
  }
}
