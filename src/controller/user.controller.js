import aqp from "api-query-params";
import { generateToken } from "../config/jwtToken.js";
import transporter from "../config/nodeMailer.js";
import { ErrorCustom } from "../helper/ErrorCustom.js";
import User from "../model/user.js";
import {
    errorResponse400,
    errorResponse500,
    successResponse,
    successResponseList,
} from "../utils/responseHandler.js";
import validateMongoDbId from "../utils/validateMongodbId.js";
import bcrypt from "bcrypt";
import UserDetail from "../model/userDetail.js";
import mongoose from "mongoose";

const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await UserDetail.findOne({
            email: username,
            username,
        });
        if (existingUser) {
            return errorResponse400(res, "Người dùng đã tồn tại");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            ...req.body,
            password: hashedPassword,
        });

        await user.save();
        const userDetail = new UserDetail({
            ...req.body,
            userId: user._id,
        });

        await userDetail.save();

        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: req.body.email,
            subject: "Chào mừng tới với cửa hàng ShoeFast",
            text: `Chào mừng tới với cửa hàng ShoeFast. User name vừa được tạo mới là :${user.username}`,
        };

        await transporter.sendMail(mailOptions);

        return successResponse(res, "Tạo người dùng thành công!");
    } catch (error) {
        return errorResponse500(res, error.message);
    }
};

const getAllUser = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        let { page = 0, size = 10, isActive } = filter;

        page = parseInt(page);
        size = parseInt(size);

        const matchFilter = {};
        if (isActive !== undefined) {
            matchFilter.isActive = isActive === "true" || isActive === true;
        }

        const [users, total] = await Promise.all([
            UserDetail.aggregate([
                {
                    $match: matchFilter,
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user",
                    },
                },
                {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
                {
                    $project: {
                        email: 1,
                        username: 1,
                        avatar: 1,
                        fullName: 1,
                        phone: 1,
                        gender: 1,
                        address: 1,
                        birthday: 1,
                        user: {
                            isActive: 1,
                            role: 1,
                        },
                    },
                },
                { $skip: page * size },
                { $limit: size },
            ]),
            UserDetail.countDocuments(matchFilter),
        ]);

        return successResponseList(
            res,
            "Lấy danh sách người dùng thành công",
            users,
            {
                total,
                page,
                size,
                totalPages: Math.ceil(total / size),
            }
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
        const user = await User.findOne({
            _id: id,
        }).select(
            "-updatedAt -__v -createdAt -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt -isAccountVerified"
        );

        console.log("xxxxxxxxx");
        const userDetail = await UserDetail.findOne({
            userId: id,
        }).select("-updatedAt -__v -createdAt");

        const {
            email,
            username,
            avatar,
            fullName,
            phone,
            gender,
            address,
            birthday,
        } = userDetail;

        if (!user) {
            return errorResponse500(res, "Người dùng không tồn tại", null, 404);
        }

        return successResponse(res, "Lấy thông tin người dùng thành công", {
            ...user.toObject(),
            email,
            username,
            avatar,
            fullName,
            phone,
            gender,
            address,
            birthday,
        });
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
        const deleteUserById = await User.findByIdAndDelete({ _id: id });
        const deleteUserDetailById = await UserDetail.findByIdAndDelete({
            userId: id,
        });

        if (deleteUserById && deleteUserDetailById) {
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
        const [updateUserDetail, updateUser] = await Promise.all([
            UserDetail.findByIdAndUpdate(
                {
                    userId: req.body._id,
                },
                {
                    ...req.body,
                },
                { upsert: true }
            ),
            User.findByIdAndUpdate(
                {
                    _id: req.body._id,
                },
                {
                    username: req.body.username,
                    email: req.body.email,
                },
                { upsert: true }
            ),
        ]);
        if (updateUserDetail && updateUser) {
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

const getAccountByRole = async (req, res) => {
    try {
        const { filter } = aqp(req.query);
        const { page, size, isActive, roleName } = filter;

        const result = await User.aggregate([
            {
                $match: {
                    $and: [
                        isActive
                            ? {
                                  isActive: isActive,
                              }
                            : {},
                        {
                            role: roleName,
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "userDetails",
                    localField: "_id",
                    foreignField: "userId",
                    as: "userDetail",
                },
            },
            {
                $unwind: {
                    path: "$userDetail",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $skip: page * size,
            },
            {
                $limit: size,
            },
        ]);

        const total = await User.countDocuments([
            {
                isActive: isActive,
            },
            {
                roleName: roleName,
            },
        ]);

        return successResponseList(
            res,
            "Lấy danh sách người dùng thành công!",
            result,
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

export {
    createUser,
    getAllUser,
    getUserById,
    deleteUserById,
    updateUserById,
    getUserDetail,
    getAccountByRole,
};
