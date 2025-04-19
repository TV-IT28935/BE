import Attribute from "../model/attribute.js";
import { successResponse } from "../utils/responseHandler";
import validateMongoDbId from "../utils/validateMongodbId";

export const getAllAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.find({ deletedAt: null });
    return successResponse(
      res,
      "Lấy danh sách thuộc tính thành công!",
      attributes
    );
  } catch (error) {
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const getAttributeById = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const attribute = await Attribute.findById(id);
    return successResponse(res, "", attribute);
  } catch (error) {
    if (error instanceof ErrorCustom) {
      return errorResponse400(res, error.message);
    }
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const createAttribute = async (req, res) => {
  try {
    const newAttribute = await Attribute.create(req.body);
    return res.status(201).json({ success: true, data: newAttribute });
  } catch (error) {
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const updateAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const updatedAttribute = await Attribute.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return successResponse(
      res,
      "Cập nhật thuộc tính thành công!",
      updatedAttribute
    );
  } catch (error) {
    if (error instanceof ErrorCustom) {
      return errorResponse400(res, error.message);
    }
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const deleteAttribute = async (req, res) => {
  try {
    const { id } = req.params;

    validateMongoDbId(id);

    const attribute = await Attribute.findById(id);
    if (!attribute || attribute.deletedAt) {
      return successResponse(res, "Không tìm thấy thuộc tính");
    }

    attribute.deletedAt = new Date();
    await attribute.save();

    return res.json({ success: true, message: "Thuộc tính đã được xóa mềm" });
  } catch (error) {
    if (error instanceof ErrorCustom) {
      return errorResponse400(res, error.message);
    }
    return errorResponse500(res, "Lỗi server", error.message);
  }
};
