import Joi from "joi";

const categorySchemaJoi = Joi.object({
    name: Joi.string().max(50).required().messages({
        "string.empty": "Tiêu đề không được để trống",
        "string.max": "Tiêu đề không được dài quá 50 ký tự",
        "any.required": "Tiêu đề là bắt buộc",
    }),
    description: Joi.string().allow(null, "").max(255).messages({
        "string.max": "Mô tả không được dài quá 255 ký tự",
    }),
    isActive: Joi.boolean().messages({
        "boolean.base": "Trạng thái hoạt động phải là true/false.",
    }),
});

export default categorySchemaJoi;
