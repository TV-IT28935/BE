import express from "express";
import multer from "multer";
import {
    countProduct,
    createProduct,
    deleteProduct,
    filterProducts,
    getAllProduct,
    getAllProductByBrand,
    getAllProductWishList,
    getListHot,
    getProductById,
    getRecommendationById,
    relateProduct,
    searchByKeyword,
    toggleLikeProduct,
    updateProduct,
} from "../controller/product.controller.js";
import {
    authIsAdminMiddleware,
    authMiddleware,
} from "../middleware/authMiddlewares.js";
import validate from "../middleware/validate.js";
import { productSchemaJoi } from "../validation/product.validation.js";

const upload = multer();

const router = express.Router();

router.get("/get-all", getAllProduct);
router.get("/wish-list", authMiddleware, getAllProductWishList);
router.put("/like", authMiddleware, toggleLikeProduct);
router.post("/get-all/filter", filterProducts);
router.get("/by-brand", authIsAdminMiddleware, getAllProductByBrand);
router.get("/relate", relateProduct);
router.get("/recommendation", getRecommendationById);
router.get("/list/hot", getListHot);
router.get("/search", searchByKeyword);
router.get("/count", countProduct);
router.post(
    "/create",
    upload.fields([{ name: "files" }]),
    authIsAdminMiddleware,
    createProduct
);
router.put(
    "/modify",
    validate(productSchemaJoi),
    authIsAdminMiddleware,
    updateProduct
);
router.delete("/delete", authIsAdminMiddleware, deleteProduct);
router.get("/:id", getProductById);

export default router;
