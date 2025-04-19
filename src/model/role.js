import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: 1,
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
    userIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    ],
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("role", roleSchema);

export default Role;
