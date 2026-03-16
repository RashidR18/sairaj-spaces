/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { base64, filename } = await req.json();
    
    // Validate
    if (!base64 || !filename) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 });
    }

    const buffer = Buffer.from(base64.split(",")[1], "base64");
    const filepath = path.join(process.cwd(), "public", filename);
    
    fs.writeFileSync(filepath, buffer);
    
    return NextResponse.json({ url: `/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
