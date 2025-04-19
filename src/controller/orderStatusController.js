import OrderStatus from "../model/orderStatus.js";
import validateMongoDbId from "../utils/validateMongodbId";

export const getAllOrderStatus = async (req, res) => {
  try {
    const orderStatus = await OrderStatus.find({ deletedAt: null });
    return successResponse(
      res,
      "Lấy danh sách trạng thái đơn hàng thành công!",
      orderStatus
    );
  } catch (error) {
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const getOrderStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const orderStatus = await OrderStatus.findById(id);
    return successResponse(
      res,
      "Lấy trạng thái đơn hàng thành công!",
      orderStatus
    );
  } catch (error) {
    if (error instanceof ErrorCustom) {
      return errorResponse400(res, error.message);
    }
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const createOrderStatus = async (req, res) => {
  try {
    const newOrderStatus = await OrderStatus.create(req.body);
    return successResponse(
      res,
      "Tạo trạng thái đơn hàng thành công!",
      newOrderStatus
    );
  } catch (error) {
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const updatedOrderStatus = await OrderStatus.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    return successResponse(
      res,
      "Cập nhật trạng thái đơn hàng thành công!",
      updatedOrderStatus
    );
  } catch (error) {
    if (error instanceof ErrorCustom) {
      return errorResponse400(res, error.message);
    }
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const deleteOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const orderStatus = await OrderStatus.findById(id);
    if (!orderStatus || orderStatus.deletedAt) {
      return notFoundResponse(
        res,
        "Không tìm thấy trạng thái đơn hàng",
        null,
        404
      );
    }
  } catch (error) {
    if (error instanceof ErrorCustom) {
      return errorResponse400(res, error.message);
    }
    return errorResponse500(res, "Lỗi server", error.message);
  }
};
