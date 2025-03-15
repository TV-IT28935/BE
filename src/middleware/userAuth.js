import { authorizationResponse } from "../utils/responseHandler.js";
import jwt from "jsonwebtoken";
const userAuth = async (req, res, next) => {
  try {
    const { access_token } = req.cookies;

    if (!access_token) {
      return authorizationResponse(
        res,
        "Bạn không được phép. Xin mời đăng nhập lại!"
      );
    }

    const decodedUser = jwt.verify(access_token, process.env.JWT_SECRET);

    if (!decodedUser) {
      return authorizationResponse(res, "Token không hợp lệ!");
    }

    req.user = { id: decodedUser.id };

    next();
  } catch (error) {
    return authorizationResponse(
      res,
      "Phiên đăng nhập hết hạn hoặc không hợp lệ!"
    );
  }
};

export default userAuth;
