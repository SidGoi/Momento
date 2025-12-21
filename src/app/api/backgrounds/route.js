import { connectDB } from "lib/db";
import Background from "models/Background";
import { NextResponse } from "next/server";

// GET: Used by CreateCard to show the list of selectable themes
export async function GET() {
  try {
    await connectDB();
    const backgrounds = await Background.find().sort({ createdAt: -1 });
    return NextResponse.json(backgrounds, { status: 200 });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST: Used by AddBackground to save new assets
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const background = await Background.create({ ...body });
    return NextResponse.json(background, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Used by the Admin Panel to remove assets
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const deletedBg = await Background.findByIdAndDelete(id);
    
    if (!deletedBg) {
      return NextResponse.json({ error: "Background not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}