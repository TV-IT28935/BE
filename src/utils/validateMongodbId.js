import mongoose from "mongoose";
import { ErrorCustom } from "../helper/ErrorCustom.js";

const validateMongoDbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new ErrorCustom("ID không hợp lệ", 400);
  }
};

export default validateMongoDbId;
