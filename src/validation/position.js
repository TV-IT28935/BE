import Joi from "joi";

const positionSchemaJoi = Joi.object({
  id: Joi.string().optional(), 
  name: Joi.string().max(10).required().messages({
    "string.base": "Mã vị trí phải là chuỗi.",
    "string.empty": "Mã vị trí không được để trống.",
    "string.max": "Mã vị trí không được vượt quá {#limit} ký tự.",
    "any.required": "Mã vị trí là bắt buộc.",
  }),
  description: Joi.string().allow("").messages({
    "string.base": "Mô tả phải là chuỗi.",
  }),
});

export default positionSchemaJoi;
