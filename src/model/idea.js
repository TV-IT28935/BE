import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxLength: 255 },
    content: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    voteCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isDrafted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    type: {
      type: String,
      enum: ["idea", "proposal", "suggestion"],
      required: true,
    },
    linkUrl: { type: String },
    linkImage: { type: String },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "group",
      required: true,
    },
  },
  { timestamps: true }
);

const Idea = mongoose.model("idea", ideaSchema);

export default Idea;
