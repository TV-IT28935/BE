import mongoose from "mongoose";

const userGroupSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const User_Group = mongoose.model("user_group", userGroupSchema);

export default User_Group;
