/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const { name, email, phone, subject, message } = body;
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newContact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    return NextResponse.json({ success: true, data: newContact }, { status: 201 });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit form" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json(contacts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await Contact.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Message deleted successfully" });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete message" }, { status: 500 });
  }
}
