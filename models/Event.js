import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String, required: true },
});

const EventSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, required: true },

    userId: { type: String, required: true },

    host: {
      name: { type: String, required: true },
      avatar: { type: String, required: true },
      id: { type: String, required: true },
    },

    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    coverImage: { type: String, required: true },

    font: {
      type: Object,
      default: { heading: "Playfair_Display", body: "Inter" },
    },

    background: {
      type: Object,
      default: {
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
    },

    rsvp: {
      type: Boolean,
      default: false,
    },

    sections: [SectionSchema], // dynamic content sections
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
