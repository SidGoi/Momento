import mongoose from "mongoose";

const BackgroundSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Background ||
  mongoose.model("Background", BackgroundSchema);
