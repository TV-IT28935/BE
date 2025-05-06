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
} from "../controller/productController.js";
import validate from "../middleware/validate.js";
import { productSchemaJoi } from "../validation/product.js";

const router = express.Router();

router.get("/get-all", getAllProduct);
router.get("/wish-list", getAllProductWishList);
router.put("/like", toggleLikeProduct);
router.post("/get-all/filter", filterProducts);
router.get("/:id", getProductById);
router.get("/relate", relateProduct);
router.get("/recommendation", getRecommendationById);
router.get("/list/hot", getListHot);
router.get("/search", searchByKeyword);
router.get("/count", countProduct);
router.get("/by-brand", getAllProductByBrand);
router.post("/create", validate(productSchemaJoi), createProduct);
router.put("/modify", validate(productSchemaJoi), updateProduct);
router.delete("/delete", deleteProduct);

export default router;
