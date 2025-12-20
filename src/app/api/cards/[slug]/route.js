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

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { slug } = params;

    // 🔍 Find card by slug
    const card = await Card.findOne({ slug });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // 🔐 Ownership check
    if (card.userId !== user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    // 🗑 Delete card
    await Card.deleteOne({ slug });

    return NextResponse.json(
      { message: "Card deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
