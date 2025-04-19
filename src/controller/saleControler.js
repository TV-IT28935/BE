import aqp from "api-query-params";
import Sale from "../model/sale.js";
import { paginateModel } from "../utils/paginateModel.js";
import validateMongoDbId from "../utils/validateMongodbId.js";
import {
  errorResponse400,
  errorResponse500,
  notFoundResponse,
  successResponse,
  successResponseList,
} from "../utils/responseHandler.js";
import { ErrorCustom } from "../helper/ErrorCustom.js";

export const getAllSale = async (req, res) => {
  try {
    const { filter } = aqp(req.query);
    const { page, size, ...filterQuery } = filter;

    const { data: sales, pagination } = await paginateModel({
      model: Sale,
      page,
      size,
      filter: filterQuery,
    });

    return successResponseList(
      res,
      "Lấy danh sách giảm giá thành công!",
      sales,
      pagination
    );
  } catch (error) {
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const sale = await Sale.findById(id);

    if (!sale) {
      return notFoundResponse(res, "Không tìm thấy giảm giá", null, 404);
    }

    return successResponse(res, "Lấy thông tin giảm giá thành công!", sale);
  } catch (error) {
    if (error instanceof ErrorCustom) {
      return errorResponse400(res, error.message);
    }
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const createSale = async (req, res) => {
  try {
    const { userId, productId, quantity, totalPrice } = req.body;
    const newSale = await Sale.create({
      userId,
      productId,
      quantity,
      totalPrice,
    });

    return successResponse(res, "Tạo đơn hàng thành công!", newSale);
  } catch (error) {
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const updatedSale = await Sale.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true }
    );

    return successResponse(res, "Cập nhật giảm giá thành công!", updatedSale);
  } catch (error) {
    if (error instanceof ErrorCustom) {
      return errorResponse400(res, error.message);
    }
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const deletedSale = await Sale.findByIdAndDelete(id);
    if (!deletedSale) {
      return notFoundResponse(res, "Không tìm thấy đơn hàng", null, 404);
    }
    return successResponse(res, "Xóa đơn hàng thành công!");
  } catch (error) {
    if (error instanceof ErrorCustom) {
      return errorResponse400(res, error.message);
    }
    return errorResponse500(res, "Lỗi server", error.message);
  }
};
