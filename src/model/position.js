import mongoose from "mongoose";

const positionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 20,
    },
    description: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Position = mongoose.model("position", positionSchema);

export default Position;
