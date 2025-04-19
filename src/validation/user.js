import Joi from "joi";
import mongoose from "mongoose";

const userSchemaJoi = Joi.object({
  id: Joi.string().optional(),
  email: Joi.string().email().min(5).max(50).required().messages({
    "string.email": "Email không hợp lệ.",
    "string.min": "Email phải có ít nhất 5 ký tự.",
    "string.max": "Email không được vượt quá 50 ký tự.",
    "any.required": "Email là bắt buộc.",
  }),

  password: Joi.string().min(6).max(60).required().messages({
    "string.min": "Mật khẩu phải có ít nhất 6 ký tự.",
    "string.max": "Mật khẩu không được vượt quá 60 ký tự.",
    "any.required": "Mật khẩu là bắt buộc.",
  }),

  username: Joi.string().min(3).max(50).required().messages({
    "string.min": "Tên người dùng phải có ít nhất 3 ký tự.",
    "string.max": "Tên người dùng không được quá 50 ký tự.",
    "any.required": "Tên người dùng là bắt buộc.",
  }),

  avatar: Joi.string().max(255).optional().allow("").messages({
    "string.max": "Avatar không được vượt quá 255 ký tự.",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Số điện thoại phải có đúng 10 chữ số.",
      "any.required": "Số điện thoại là bắt buộc.",
    }),

  status: Joi.string()
    .valid("active", "inactive", "banned")
    .default("active")
    .messages({
      "any.only":
        "Trạng thái chỉ có thể là 'active', 'inactive' hoặc 'banned'.",
    }),

  isOnline: Joi.boolean().default(false).messages({
    "boolean.base": "Giá trị của isOnline phải là true hoặc false.",
  }),

  jobPosition: Joi.string().optional().allow("").messages({
    "string.base": "Chức vụ phải là một chuỗi ký tự.",
  }),

  introduce: Joi.string().optional().allow("").messages({
    "string.base": "Giới thiệu phải là một chuỗi ký tự.",
  }),

  deletedAt: Joi.date().allow(null).optional().messages({
    "date.base": "deletedAt phải là kiểu ngày hợp lệ.",
  }),
});

export default userSchemaJoi;
