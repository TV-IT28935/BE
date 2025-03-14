import mongoose from "mongoose";

const userGroupSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "group",
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
