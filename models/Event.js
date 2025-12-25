import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    username: { type: String, required: true },
    userIcon: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true } // Changed to true to give each comment a unique key for React
);

const SocialLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: true }
);

const SectionSchema = new mongoose.Schema({
  heading: { type: String },
  description: { type: String },
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
    font: {
      heading: { type: String, default: "Poppins" },
      body: { type: String, default: "Inter" },
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    coverImage: { type: String, required: true },
    background: {
      name: { type: String },
      theme: { type: String, enum: ["light", "dark"] },
      url: { type: String },
    },
    commentsEnabled: { type: Boolean, default: true },
    comments: [CommentSchema],
    sections: [SectionSchema],
    socialLinks: [SocialLinkSchema],
  },
  { timestamps: true }
);

// This ensures the model is not overwritten during Hot Module Replacement (HMR)
export default mongoose.models.Event || mongoose.model("Event", EventSchema);
