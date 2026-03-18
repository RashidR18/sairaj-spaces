import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const dataFilePath = path.join(process.cwd(), "content.json");
    
    if (!fs.existsSync(dataFilePath)) {
       // Fallback to basic check if file doesn't exist yet
       if (email === "admin@sairaj.com" && password === "sairaj123") {
         return NextResponse.json({ success: true });
       }
       return NextResponse.json({ error: "Configuration not found" }, { status: 500 });
    }

    const data = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
    const admin = data.adminProfile;

    if (admin && admin.email === email && admin.password === password) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
