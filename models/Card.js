import mongoose from "mongoose";

const CardSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    host: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
    },

    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },

    font: {
      type: String,
    },  

    background: {
      name: {
        type: String,
      },
      theme: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Card || mongoose.model("Card", CardSchema);
