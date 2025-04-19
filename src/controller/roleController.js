import Role from "../model/role.js";
import validateMongoDbId from "../utils/validateMongodbId";

export const getAllRole = async (req, res) => {
  try {
    const roles = await Role.find();
    return successResponse(res, "Lấy danh sách quyền thành công!", roles);
  } catch (error) {
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const role = await Role.findById(id);

    if (!role) {
      return errorResponse500(res, "Không tìm thấy quyền", null, 404);
    }

    return successResponse(res, "Lấy quyền thành công!", role);
  } catch (error) {
    if (error instanceof ErrorCustom) {
      return errorResponse400(res, error.message);
    }
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const createRole = async (req, res) => {
  try {
    const newRole = await Role.create(req.body);
    return successResponse(res, "Tạo quyền thành công!", newRole);
  } catch (error) {
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const updatedRole = await Role.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return successResponse(res, "Cập nhật quyền thành công!", updatedRole);
  } catch (error) {
    if (error instanceof ErrorCustom) {
      return errorResponse400(res, error.message);
    }
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) {
      return notFoundResponse(res, "Không tìm thấy quyền", null, 404);
    }
    return successResponse(res, "Xóa quyền thành công!");
  } catch (error) {
    if (error instanceof ErrorCustom) {
      return errorResponse400(res, error.message);
    }
    return errorResponse500(res, "Lỗi server", error.message);
  }
};
