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
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("role", roleSchema);

export default Role;
