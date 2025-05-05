import { generateToken } from "../config/jwtToken.js";
import transporter from "../config/nodeMailer.js";
import { ErrorCustom } from "../helper/ErrorCustom.js";
import Role from "../model/role.js";
import User from "../model/user.js";
import {
    errorResponse400,
    errorResponse500,
    successResponse,
} from "../utils/responseHandler.js";
import validateMongoDbId from "../utils/validateMongodbId.js";
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return errorResponse400(res, "Email người dùng đã tồn tại");
        }
        const defaultRole = await Role.findOne({ name: "USER" });
        if (!defaultRole) {
            return errorResponse400(res, "Không tìm thấy vai trò mặc định!");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            roleId: defaultRole._id,
            ...req.body,
            password: hashedPassword,
        });
        defaultRole.isUsed = true;

        await defaultRole.save();
        await user.save();

        const access_token = generateToken(user._id);

        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        });

        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: "Chào mừng tới với mạng xã hội FUNNY",
            text: `Chào mừng tới với mạng xã hội FUNNY. Email vừa được tạo mới là :${email}`,
        };

        await transporter.sendMail(mailOptions);

        return successResponse(res, "Tạo người dùng thành công!");
    } catch (error) {
        return errorResponse500(res, error.message);
    }
};

const getAllUser = async (req, res) => {
    try {
        const users = await User.find({});
        return successResponse(
            res,
            "Lấy danh sách người dùng thành công",
            users
        );
    } catch (error) {
        return errorResponse500(
            res,
            "Lỗi khi lấy danh sách người dùng",
            error.message
        );
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const user = await User.findById(id);

        if (!user) {
            return errorResponse500(res, "Người dùng không tồn tại", null, 404);
        }

        return successResponse(
            res,
            "Lấy thông tin người dùng thành công",
            user
        );
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

const getUserDetail = async (req, res) => {
    const user = req.user;

    return successResponse(res, "Lấy thông tin người dùng thành công", user);
};

const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        validateMongoDbId(id);
        const deleteUserById = await User.findByIdAndDelete(id);
        if (deleteUserById) {
            return successResponse(res, "Thành công!");
        } else {
            return errorResponse400(res, "Người dùng không tồn tại!");
        }
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

const updateUserById = async (req, res) => {
    try {
        const { _id } = req.user;
        validateMongoDbId(_id);
        const updateUserById = await User.findByIdAndUpdate(_id, req.body, {
            new: true,
        });
        if (updateUserById) {
            await updateUserById.save();
            return successResponse(res, "Thành công!");
        } else {
            return errorResponse400(res, "Người dùng không tồn tại!");
        }
    } catch (error) {
        if (error instanceof ErrorCustom) {
            return errorResponse400(res, error.message);
        }
        return errorResponse500(res, "Lỗi server", error.message);
    }
};

export {
    createUser,
    getAllUser,
    getUserById,
    deleteUserById,
    updateUserById,
    getUserDetail,
};
