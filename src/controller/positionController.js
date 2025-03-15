import Position from "../model/position.js";
import {
  errorResponse400,
  errorResponse500,
  successResponse,
} from "../utils/responseHandler.js";
import validateMongoDbId from "../utils/validateMongodbId.js";

const createPosition = async (req, res) => {
  const { name } = req.body;
  try {
    const existingPosition = await Position.findOne({ name });
    if (existingPosition) {
      return errorResponse400(res, "Vị trí này đã tồn tại!");
    }

    const position = new Position({ ...req.body });
    await position.save();

    return successResponse(res, "Thêm mới thành công!");
  } catch (error) {
    return errorResponse500(res, error.message);
  }
};

const getAllPosition = async (req, res) => {
  try {
    const positions = await Position.find({});
    return successResponse(res, "Lấy dữ liệu thành công!", positions);
  } catch (error) {
    return errorResponse500(res, error.message);
  }
};

const getPosition = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const position = await Position.findById(id);
    if (!position) {
      return errorResponse400(res, "Không tìm thấy vị trí!");
    }
    return successResponse(res, "Lấy dữ liệu thành công!", position);
  } catch (error) {
    return errorResponse500(res, error.message);
  }
};

const updatePosition = async (req, res) => {
  const { id, name, description } = req.body;
  validateMongoDbId(id);

  try {
    const position = await Position.findOne({ _id: id });

    if (!position) {
      return errorResponse400(res, "Không tìm thấy vị trí!");
    }

    if (position.isDefault) {
      return errorResponse400(res, "Vị trí mặc định không thể sửa!");
    }

    if (position.isUsed) {
      return errorResponse400(res, "Vị trí đã được sử dụng, không thể sửa!");
    }

    const updatedPosition = await Position.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    return successResponse(
      res,
      "Cập nhật dữ liệu thành công!",
      updatedPosition
    );
  } catch (error) {
    return errorResponse500(res, error.message);
  }
};

const deletePosition = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const position = await Position.findByIdAndDelete(id);
    if (!position) {
      return errorResponse400(res, "Không tìm thấy vị trí!");
    }
    return successResponse(res, "Xóa thành công!");
  } catch (error) {
    return errorResponse500(res, error.message);
  }
};

export {
  createPosition,
  getAllPosition,
  getPosition,
  updatePosition,
  deletePosition,
};
