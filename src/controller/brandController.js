import Brand from "../model/brand.js";
import validateMongoDbId from "../utils/validateMongodbId.js";

const getAllBrand = async (req, res) => {
  try {
    const { page, size, sort, filter } = req.query;
    const { data, pagination } = await paginateModel({
      model: Brand,
      filter: {
        ...filter,
        deletedAt: null,
      },
      sort: {
        ...sort,
      },
      page: parseInt(page) || 0,
      size: parseInt(size) || 10,
    });

    return successResponse(
      res,
      "Lấy danh sách thương hiệu thành công!",
      data,
      pagination
    );
  } catch (error) {
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const brand = await Brand.findById(id).populate("products");
    if (!brand) {
      return notFoundResponse(res, "Không tìm thấy thương hiệu", null, 404);
    }
    return successResponse(res, "Lấy thương hiệu thành công!", brand);
  } catch (error) {
    if (error instanceof ErrorCustom) {
      return errorResponse400(res, error.message);
    }
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

const createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;
    const brand = await Brand.create({
      name,
      description,
    });
    return successResponse(res, "Thêm thương hiệu thành công!", brand);
  } catch (error) {
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const brand = await Brand.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true }
    );
    if (!brand) {
      return notFoundResponse(res, "Không tìm thấy thương hiệu", null, 404);
    }
    return successResponse(res, "Cập nhật thương hiệu thành công!", brand);
  } catch (error) {
    if (error instanceof ErrorCustom) {
      return errorResponse400(res, error.message);
    }
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const brand = await Brand.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
      },
      { new: true }
    );
    if (!brand) {
      return notFoundResponse(res, "Không tìm thấy thương hiệu", null, 404);
    }
    return successResponse(res, "Xóa thương hiệu thành công!", brand);
  } catch (error) {
    if (error instanceof ErrorCustom) {
      return errorResponse400(res, error.message);
    }
    return errorResponse500(res, "Lỗi server", error.message);
  }
};

export { getAllBrand, getBrandById, createBrand, updateBrand, deleteBrand };
