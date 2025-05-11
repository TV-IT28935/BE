import aqp from "api-query-params";
import Attribute from "../model/attribute.js";
import {
    errorResponse400,
    errorResponse500,
    successResponse,
} from "../utils/responseHandler.js";
import validateMongoDbId from "../utils/validateMongodbId.js";
import { ErrorCustom } from "../helper/ErrorCustom.js";

export const getAttribute = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        const { productId, size } = filter;
        validateMongoDbId(productId);
        const attributes = await Attribute.findOne({
            $and: [
                {
                    product: productId,
                },
                {
                    size,
                },
            ],
        });
        return successResponse(
            res,
            "Lấy danh sách thuộc tính thành công!",
            attributes
        );
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
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
