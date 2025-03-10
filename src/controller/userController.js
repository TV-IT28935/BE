import { validationResult } from "express-validator";
import User from "../model/user.js";
import {
  successResponse,
  errorResponse500,
  errorResponse400,
} from "../utils/responseHandler.js";

const createUser = async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      const newUser = await User.create(req.body);
      return res.json(newUser);
    } else {
      return errorResponse400(res, "Email người dùng đã tồn tại");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    return successResponse(res, "Lấy danh sách người dùng thành công", users);
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
    const user = await User.findById(id);

    if (!user) {
      return errorResponse500(res, "Người dùng không tồn tại", null, 404);
    }

    return successResponse(res, "Lấy thông tin người dùng thành công", user);
  } catch (error) {
    return errorResponse500(
      res,
      "Lỗi khi lấy thông tin người dùng",
      error.message
    );
  }
};

export { createUser, getAllUser, getUserById };
