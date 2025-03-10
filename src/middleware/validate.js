import { errorResponse400 } from "../utils/responseHandler.js";

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return errorResponse400(
      res,
      "Lỗi",
      error.details.map((err) => ({
        field: err.path[0],
        message: err.message,
      }))
    );
  }
  next();
};

export default validate;
