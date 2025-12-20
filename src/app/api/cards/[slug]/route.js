import { connectDB } from "lib/db";
import Card from "models/Card";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { slug } = await params;
    console.log("SLUG:", slug);

    const card = await Card.findOne({ slug });

    if (!card) {
      return NextResponse.json({ message: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
