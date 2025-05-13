import Joi from "joi";

const userSchemaJoi = Joi.object({
    id: Joi.string().optional(),
    email: Joi.string().email().min(5).max(255).required().messages({
        "string.email": "Email không hợp lệ.",
        "string.min": "Email phải có ít nhất 5 ký tự.",
        "string.max": "Email không được vượt quá 255 ký tự.",
        "any.required": "Email là bắt buộc.",
    }),
    fullName: Joi.string().max(255).required().messages({
        "string.max": "Full name không được vượt quá 255 ký tự.",
        "any.required": "Full name là bắt buộc.",
    }),
    birthdate: Joi.string().max(255).required().messages({
        "string.max": "Ngày sinh không được vượt quá 255 ký tự.",
        "any.required": "Ngày sinh là bắt buộc.",
    }),
    gender: Joi.string().max(10).required().messages({
        "any.required": "Giới tính là bắt buộc.",
    }),
    address: Joi.string().max(255).required().messages({
        "string.max": "Địa chỉ không được vượt quá 255 ký tự.",
        "any.required": "Địa chỉ là bắt buộc.",
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
});

export default userSchemaJoi;
