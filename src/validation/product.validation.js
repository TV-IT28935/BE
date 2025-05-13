import Joi from "joi";
import mongoose from "mongoose";

export const productSchemaJoi = Joi.object({
  code: Joi.string().required().messages({
    "string.base": "Mã sản phẩm phải là chuỗi.",
    "string.empty": "Mã sản phẩm không được để trống.",
    "any.required": "Mã sản phẩm là bắt buộc.",
  }),

  name: Joi.string().required().messages({
    "string.base": "Tên sản phẩm phải là chuỗi.",
    "string.empty": "Tên sản phẩm không được để trống.",
    "any.required": "Tên sản phẩm là bắt buộc.",
  }),

  description: Joi.string().allow("").messages({
    "string.base": "Mô tả phải là chuỗi.",
  }),

  isActive: Joi.boolean().messages({
    "boolean.base": "Trạng thái hoạt động phải là true/false.",
  }),

  brand: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("roleId không hợp lệ.");
      }
      return value;
    })
    .messages({
      "any.invalid": "ID thương hiệu không hợp lệ.",
    }),

  sale: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("roleId không hợp lệ.");
      }
      return value;
    })
    .messages({
      "any.invalid": "ID chương trình giảm giá không hợp lệ.",
    }),

  view: Joi.number().min(0).default(0).messages({
    "number.base": "Lượt xem phải là số.",
    "number.min": "Lượt xem không được âm.",
  }),

  categoryIds: Joi.array()
    .items(
      Joi.string().custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.message("roleId không hợp lệ.");
        }
        return value;
      })
    )
    .messages({
      "array.base": "Danh sách category phải là mảng.",
      "any.invalid": "ID category không hợp lệ.",
    }),
});
