import { connectDB } from "lib/db";
import Card from "models/Card";
import { NextResponse } from "next/server";

// Handle GET (For fetching card data)
export async function GET(req, { params }) {
  await connectDB();
  const { slug } = await params;
  try {
    const card = await Card.findOne({ slug });
    if (!card)
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
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
    if (!deletedCard)
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    
    // 1. MUST await params in Next.js 15
    const { slug } = await params; 
    
    const body = await req.json();
    const { title, description, image, background, font } = body;

    // 2. Find by slug and update
    // Using { $set } ensures we only update the fields provided
    const updatedCard = await Card.findOneAndUpdate(
      { slug: slug },
      {
        $set: {
          title,
          description,
          image,
          background,
          font,
        },
      },
      { new: true, runValidators: true } 
    );

    if (!updatedCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Card updated successfully", updatedCard },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}