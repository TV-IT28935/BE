import mongoose from "mongoose";

const rolePermissionSchema = new mongoose.Schema(
  {
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
      required: true,
    },
    permissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "permission",
      required: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Role_Permission = mongoose.model("role_permission", rolePermissionSchema);

export default Role_Permission;
