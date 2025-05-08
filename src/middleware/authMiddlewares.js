import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import {
    authenticationResponse,
    authorizationResponse,
} from "../utils/responseHandler.js";
dotenv.config();

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return authorizationResponse(
            res,
            "There is no token attached to header"
        );
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedUser?.id);

        if (!user) {
            return authenticationResponse(res, "User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        return authenticationResponse(res, "Not Authorized or token expired");
    }
};

const authIsAdminMiddleware = async (req, res, next) => {};

export { authMiddleware, authIsAdminMiddleware };
