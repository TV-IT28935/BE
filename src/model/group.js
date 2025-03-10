import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String },
    avatar: { type: String, maxLength: 255 },
    background: { type: String, maxLength: 255 },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("group", groupSchema);

export default Group;
