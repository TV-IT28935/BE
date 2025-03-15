import { generateToken } from "../config/jwtToken.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import User from "../model/user.js";
import bcrypt from "bcrypt";
import {
  errorResponse400,
  errorResponse500,
  successResponse,
} from "../utils/responseHandler.js";
import transporter from "../config/nodeMailer.js";

const loginUser = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return errorResponse400(res, "Email không tồn tại");
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return errorResponse400(res, "Mật khẩu không đúng");
    }

    if (existingUser.verifyOtp === "" || existingUser.verifyOtp !== otp) {
      return errorResponse400(res, "Mã OTP không đúng!");
    }
    if (existingUser.verifyOtpExpireAt < Date.now()) {
      return errorResponse400(res, "Mã OTP hết hạn!");
    }

    existingUser.verifyOtp = "";
    existingUser.verifyOtpExpireAt = 0;
    existingUser.isAccountVerified = true;

    await existingUser.save();

    const refreshToken = generateRefreshToken(existingUser._id);
    const accessToken = generateToken(existingUser._id);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, "Thành công!", {
      id: existingUser._id,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return errorResponse500(res, error.message);
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse500(res, "User không tồn tại!");
    }

    if (user.isAccountVerified) {
      return successResponse(res, "Tài khoản đã được xác minh!");
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpire = Date.now() + 10 * 60 * 1000;

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = otpExpire;

    await user.save();

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: user.email,
      subject: "Xác thực mã OTP",
      text: `Mã OTP của bạn là: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return successResponse(res, "Gửi mã OTP đến bạn thành công!");
  } catch (error) {
    return errorResponse500(res, error.message);
  }
};

// const verifyOtp = async (req, res) => {
//   const { otp } = req.body;
//   const userId = req.user?.id;
//   if (!userId || !otp) {
//     return errorResponse400(res, "Người dùng không tồn tại!");
//   }
//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return errorResponse400(res, "Người dùng không tồn tại!");
//     }
//     if (user.verifyOtp === "" || user.verifyOtp !== otp) {
//       return errorResponse400(res, "Mã OTP không đúng!");
//     }
//     if (user.verifyOtpExpireAt < Date.now()) {
//       return errorResponse400(res, "Mã OTP hết hạn!");
//     }
//     user.verifyOtp = "";
//     user.verifyOtpExpireAt = 0;
//     user.isAccountVerified = true;

//     await user.save();

//     return successResponse(res, "Xác thực thành công!");
//   } catch (error) {
//     return errorResponse500(res, error.message);
//   }
// };

const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    user.isAccountVerified = false;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: false,
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: false,
    });

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
    });

    return successResponse(res, "Thoát đăng nhập thành công!");
  } catch (error) {
    return errorResponse500(res, error.message);
  }
};

const forgotPasswordToken = async (req, res) => {};

const resetPassword = async (req, res) => {
  const { email, passwordNew, otp } = req.body;
  if (!email || !passwordNew || !otp) {
    return errorResponse400(res, "Bạn nhập thiếu dữ liệu!");
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse400(res, "Email không tồn tại");
    }
  } catch (error) {
    return errorResponse500(res, error.message);
  }
};

const changePassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse400(res, "Email không tồn tại!");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorResponse400(res, "Mật khẩu không đúng!");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;

    await user.save();

    return successResponse(res, "Đổi mật khẩu thành công!");
  } catch (error) {
    return errorResponse500(res, error.message);
  }
};

const handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    if (!refreshToken) {
      throw new Error("No refresh token in cookies");
    }
    const user = await User.findOne({ refreshToken });
    if (!user) {
      throw new Error("Not refresh token present in db");
    }
    const accessToken = generateToken(user._id);
    return res.json({
      accessToken: accessToken,
    });
  } catch (error) {
    return errorResponse500(res, error.message);
  }
};

// const sendOtpResetPassword= async (req, res) => {
//   const {email} = req.body
//   try {
//     const user = await User.findOne({email});

//     if (!user) {
//       return errorResponse500(res, "User không tồn tại!");
//     }

//     const otp = String(Math.floor(100000 + Math.random() * 900000));
//     const otpExpire = Date.now() + 10 * 60 * 1000;

//     user.resetOtp = otp;
//     user.resetOtpExpireAt = otpExpire;

//     await user.save();

//     const mailOptions = {
//       from: process.env.MAIL_USERNAME,
//       to: user.email,
//       subject: "Xác thực mã OTP thay đổi mật khẩu",
//       text: `Mã OTP của bạn là: ${otp}`,
//     };

//     await transporter.sendMail(mailOptions);

//     return successResponse(res, "Gửi mã OTP đến bạn thành công!");
//   } catch (error) {
//     return errorResponse500(res, error.message);
//   }
// };

export {
  loginUser,
  logout,
  forgotPasswordToken,
  resetPassword,
  handleRefreshToken,
  changePassword,
  sendOtp,
  // verifyOtp,
};
