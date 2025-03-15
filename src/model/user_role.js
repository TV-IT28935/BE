import mongoose from "mongoose";

const userRoleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
      required: true,
    },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const User_Role = mongoose.model("user_role", userRoleSchema);

export default User_Role;
