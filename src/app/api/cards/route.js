import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { connectDB } from "lib/db";
import Card from "models/Card";
import slugify from "slugify";

export async function POST(req) {
  try {
    await connectDB();

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const body = await req.json();

    // 1. Generate slug automatically from title + random string
    const generatedSlug =
      slugify(body.title, { lower: true, strict: true }) +
      "-" +
      Math.random().toString(36).substring(2, 7);

    // 2. Use user data from Clerk for the host fields
    const card = await Card.create({
      slug: generatedSlug,
      userId: user.id,
      title: body.title,
      description: body.description,
      image: body.image,
      host: {
        name: `${user.firstName} ${user.lastName || ""}`.trim(),
        avatar: user.imageUrl,
      },
      background: body.background,
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    // Get the search parameters from the URL
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let cards;

    if (userId) {
      // Find cards belonging to a specific user
      cards = await Card.find({ userId }).sort({ createdAt: -1 });
    } else {
      // Find all cards
      cards = await Card.find({}).sort({ createdAt: -1 });
    }

    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}
