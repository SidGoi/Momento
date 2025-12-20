
import { connectDB } from "lib/db";
import Card from "models/Card";
import { NextResponse } from "next/server";

// Handle GET (For fetching card data)
export async function GET(req, { params }) {
  await connectDB();
  const { slug } = await params;
  try {
    const card = await Card.findOne({ slug });
    if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });
    return NextResponse.json(card);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Handle DELETE
export async function DELETE(req, { params }) {
  await connectDB();
  const { slug } = await params;
  try {
    const deletedCard = await Card.findOneAndDelete({ slug });
    if (!deletedCard) return NextResponse.json({ error: "Card not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}