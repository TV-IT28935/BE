import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProduct,
    updateProduct,
    getProductById,
    getAllProductByBrand,
    countProduct,
    searchByKeyword,
    getListHot,
    getRecommendationById,
    relateProduct,
    toggleLikeProduct,
    getAllProductWishList,
    filterProducts,
} from "../controller/product.controller.js";
import validate from "../middleware/validate.js";
import { productSchemaJoi } from "../validation/product.js";
import multer from "multer";
import {
    authIsAdminMiddleware,
    authMiddleware,
} from "../middleware/authMiddlewares.js";

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
router.post("/create", upload.fields([{ name: "files" }]), createProduct);
router.put("/modify", validate(productSchemaJoi), updateProduct);
router.delete("/delete", deleteProduct);
router.get("/:id", getProductById);

export default router;
