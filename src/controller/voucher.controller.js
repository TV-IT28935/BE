import aqp from "api-query-params";
import { ErrorCustom } from "../helper/ErrorCustom.js";
import Voucher from "../model/voucher.js";
import {
    errorResponse400,
    errorResponse500,
    successResponse,
    successResponseList,
} from "../utils/responseHandler.js";
import validateMongoDbId from "../utils/validateMongodbId.js";

export const getAllVouchers = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        const { page, size, isActive } = filter;
        const [vouchers, total] = await Promise.all([
            Voucher.aggregate([
                {
                    $match: {
                        isActive: true,
                    },
                },
                {
                    $skip: page * size,
                },
                {
                    $limit: size,
                },
            ]),
            Voucher.countDocuments({ isActive: true }),
        ]);
        return successResponseList(
            res,
            "Lấy danh sách voucher thành công!",
            vouchers,
            {
                total,
                page: page,
                size: size,
                totalPages: Math.ceil(total / size),
            }
        );
    } catch (error) {
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const getVoucherById = async (req, res) => {
    try {
        const { id } = req.query;
        validateMongoDbId(id);
        const voucher = await Voucher.findById(id).select(
            "-updatedAt -__v -createdAt"
        );

        if (!voucher || voucher.deletedAt) {
            return successResponse(res, "Không tìm thấy voucher");
        }

        return successResponse(res, "Lấy voucher thành công!", voucher);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const createVoucher = async (req, res) => {
    try {
        const newVoucher = await Voucher.create(req.body);
        return successResponse(res, "Tạo voucher thành công!", newVoucher);
    } catch (error) {
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const updateVoucher = async (req, res) => {
    try {
        const { _id } = req.body;
        validateMongoDbId(_id);
        const updatedVoucher = await Voucher.findByIdAndUpdate(_id, req.body, {
            new: true,
        });
        return successResponse(
            res,
            "Cập nhật voucher thành công!",
            updatedVoucher
        );
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const deleteVoucher = async (req, res) => {
    try {
        const { id } = req.params;

        if (validateMongoDbId(id)) {
            return successResponse(res, "Không tìm thấy voucher");
        }

        const voucher = await Voucher.findById(id);
        if (!voucher || voucher.deletedAt) {
            return successResponse(res, "Không tìm thấy voucher");
        }

        voucher.deletedAt = new Date();
        await voucher.save();

        return res.json({ success: true, message: "Voucher đã được xóa mềm" });
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export const getVoucherByCode = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return errorResponse400(res, "Mã giảm giá không hợp lệ!");
        }
        const voucher = await Voucher.findOne({ code }).select(
            "-updatedAt -__v -createdAt -isActive"
        );

        if (!voucher) {
            return errorResponse400(res, "Không tìm thấy voucher");
        }

        if (voucher?.expireDate && new Date(voucher.expireDate) < new Date()) {
            return errorResponse400(res, "Voucher đã hết hạn");
        }

        if (voucher?.count && voucher.count <= 0) {
            return errorResponse400(res, "Voucher đã hết lượt sử dụng");
        }

        delete voucher.count;

        return successResponse(res, "Lấy voucher thành công!", voucher);
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};
