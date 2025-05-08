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
import multer from "multer";

const upload = multer();

const router = express.Router();

console.log("xxxxxxxxxxxxx")

router.get("/get-all", getAllProduct);
router.get("/wish-list", getAllProductWishList);
router.put("/like", toggleLikeProduct);
router.post("/get-all/filter", filterProducts);
router.get("/by-brand", getAllProductByBrand);
router.get("/:id", getProductById);
router.get("/relate", relateProduct);
router.get("/recommendation", getRecommendationById);
router.get("/list/hot", getListHot);
router.get("/search", searchByKeyword);
router.get("/count", countProduct);
router.post("/create", upload.single("files"), createProduct);
router.put("/modify", validate(productSchemaJoi), updateProduct);
router.delete("/delete", deleteProduct);

export default router;
