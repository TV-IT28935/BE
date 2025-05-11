import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import {
    authenticationResponse,
    authorizationResponse,
    errorResponse400,
    errorResponse500,
} from "../utils/responseHandler.js";
dotenv.config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return authorizationResponse(
            res,
            "Vui lòng đặp nhập!"
        );
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedUser?.id);

        if (!user) {
            return authenticationResponse(res, "Không tìm thấy user nào!");
        }

        req.user = user;
        next();
    } catch (error) {
        return authenticationResponse(
            res,
            "Hết phiên đăng nhập, vui lòng đăng nhập lại!"
        );
    }
};

const authIsAdminMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return authenticationResponse(
                res,
                "Bạn chưa đăng nhập vui lòng đăng nhập!"
            );
        }

        const token = authHeader.split(" ")[1];

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedUser?.id);

        if (user.role !== "ADMIN") {
            return authorizationResponse(res, "Bạn không có quyền truy cập");
        }

        req.user = user;
        next();
    } catch (error) {
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export { authMiddleware, authIsAdminMiddleware };
