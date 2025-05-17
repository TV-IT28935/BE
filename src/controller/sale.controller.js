import aqp from "api-query-params";
import Sale from "../model/sale.js";
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
        const { page, size, isActive = true } = filter;
        const { query, search } = req.query;

        let matchFilter = {
            isActive: isActive,
        };
        let sort = { createdAt: -1 };

        const [sales, total] = await Promise.all([
            Sale.aggregate([
                { $match: matchFilter },
                { $sort: sort },
                {
                    $skip: page * size,
                },
                {
                    $limit: size,
                },
            ]),
            Sale.countDocuments(matchFilter),
        ]);

        console.log(sales, "sales");

        return successResponseList(
            res,
            "Lấy danh sách giảm giá thành công!",
            sales,
            {
                total,
                page: page,
                size: size,
                totalPages: Math.ceil(total / size),
            }
        );
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
export const getAllSaleAdmin = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        const { page, size } = filter;
        const { query, search } = req.query;

        let matchFilter = {};
        let sort = { createdAt: -1 };

        if (query) {
            let [key, value] = query.split("-");

            if (key === "name") {
                sort = { name: value === "asc" ? 1 : -1 };
            } else {
                if (key && value) {
                    matchFilter[key] = value === "true" ? true : false;
                }
            }
        }

        if (search) {
            matchFilter["$or"] = [{ name: { $regex: search, $options: "i" } }];
        }

        const [sales, total] = await Promise.all([
            Sale.aggregate([
                { $match: matchFilter },
                { $sort: sort },
                {
                    $skip: page * size,
                },
                {
                    $limit: size,
                },
            ]),
            Sale.countDocuments(matchFilter),
        ]);

        console.log(sales, "sales");

        return successResponseList(
            res,
            "Lấy danh sách giảm giá thành công!",
            sales,
            {
                total,
                page: page,
                size: size,
                totalPages: Math.ceil(total / size),
            }
        );
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const getSaleById = async (req, res) => {
    try {
        const { id } = req.query;
        validateMongoDbId(id);
        const sale = await Sale.findById(id).select(
            "-updatedAt -__v -createdAt"
        );

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
        const newSale = await Sale.create({
            ...req.body,
        });

        return successResponse(res, "Tạo đơn hàng thành công!", newSale);
    } catch (error) {
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const updateSale = async (req, res) => {
    try {
        const { _id } = req.body;
        validateMongoDbId(_id);
        const updatedSale = await Sale.findByIdAndUpdate(
            _id,
            {
                ...req.body,
            },
            { new: true }
        );

        return successResponse(
            res,
            "Cập nhật giảm giá thành công!",
            updatedSale
        );
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
