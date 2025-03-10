import { generateToken } from "../config/jwtToken.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import User from "../model/user.js";
import {
  errorResponse400,
  errorResponse500,
} from "../utils/responseHandler.js";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });

    if (!findUser) {
      return errorResponse400(res, "Email không tồn tại");
    }

    const isMatch = await findUser.isPasswordMatched(password);
    if (!isMatch) {
      return errorResponse400(res, "Mật khẩu không đúng");
    }

    const refreshToken = generateRefreshToken(findUser._id);
    const accessToken = generateToken(findUser._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    return res.json({
      id: findUser._id,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return errorResponse500(res, "Lỗi", error.message);
  }
};

const logout = async (req, res) => {};

const forgotPasswordToken = async (req, res) => {};

const resetPassword = async (req, res) => {};

const handleRefreshToken = async (req, res) => {};

const changePassword = async (req, res) => {};

export {
  loginUser,
  logout,
  forgotPasswordToken,
  resetPassword,
  handleRefreshToken,
  changePassword,
};
