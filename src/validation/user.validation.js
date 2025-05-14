import Joi from "joi";

const userSchemaJoi = Joi.object({
    _id: Joi.string().optional(),
    email: Joi.string().email().min(5).max(255).required().messages({
        "string.email": "Email không hợp lệ.",
        "string.min": "Email phải có ít nhất 5 ký tự.",
        "string.max": "Email không được vượt quá 255 ký tự.",
        "any.required": "Email là bắt buộc.",
    }),
    isActive: Joi.boolean().optional().messages({
        "boolean.base": "Trạng thái hoạt động phải là kiểu boolean.",
        "any.required": "Trường trạng thái hoạt động là bắt buộc.",
    }),
    password: Joi.string().min(3).max(60).required().messages({
        "string.min": "Mật khẩu phải có ít nhất 3 ký tự.",
        "string.max": "Mật khẩu không được vượt quá 60 ký tự.",
        "any.required": "Mật khẩu là bắt buộc.",
    }),

    username: Joi.string().max(255).required().messages({
        "string.max": "Tên người dùng không được quá 255 ký tự.",
        "any.required": "Tên người dùng là bắt buộc.",
    }),
});

export default userSchemaJoi;
