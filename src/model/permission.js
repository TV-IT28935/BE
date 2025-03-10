import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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

const Permission = mongoose.model("permission", permissionSchema);

export default Permission;
