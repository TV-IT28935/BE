import Joi from "joi";

const categorySchemaJoi = Joi.object({
  title: Joi.string().max(50).required().messages({
    "string.empty": "Tiêu đề không được để trống",
    "string.max": "Tiêu đề không được dài quá 50 ký tự",
    "any.required": "Tiêu đề là bắt buộc",
  }),
  description: Joi.string().allow(null, "").max(255).messages({
    "string.max": "Mô tả không được dài quá 255 ký tự",
  }),
  icon: Joi.string().allow(null, "").max(255).messages({
    "string.max": "Icon không được dài quá 255 ký tự",
  }),
});

export default categorySchemaJoi;
