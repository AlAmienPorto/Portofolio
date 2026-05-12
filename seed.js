const { put } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");

async function seed() {
  try {
    const dataPath = path.join(process.cwd(), "src/data/portfolio-data.json");
    const jsonString = fs.readFileSync(dataPath, "utf-8");
    
    console.log("Uploading initial data to Vercel Blob...");
    const blob = await put("portfolio-data.json", jsonString, { 
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    
    console.log("Success! Data uploaded to:", blob.url);
  } catch (error) {
    console.error("Error:", error);
  }
}

seed();
