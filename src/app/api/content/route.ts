/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "content.json");

export async function GET() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    const parsedData = JSON.parse(data);
    
    // Strip out the password from being publicly accessible
    if (parsedData.adminProfile && parsedData.adminProfile.password !== undefined) {
      delete parsedData.adminProfile.password;
    }
    
    return NextResponse.json(parsedData);
  } catch {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const existingFile = fs.readFileSync(dataFilePath, "utf8");
    const existingData = JSON.parse(existingFile);
    
    // Preserve password if it wasn't updated
    if (existingData.adminProfile?.password && !body.adminProfile?.password) {
      if (!body.adminProfile) body.adminProfile = {};
      body.adminProfile.password = existingData.adminProfile.password;
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ success: true, message: "Content updated successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
