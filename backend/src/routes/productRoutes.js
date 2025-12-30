import express from "express";
import { upload } from "../middlewares/upload.js";
import { authenticate } from "../middlewares/authMiddleware.js";

import {
  uploadProduct,
  getAllProducts,
  getMyProducts,
  getProductsBySeller,
  getProductById,
  informSold,
  getProductRecommendations,
} from "../controllers/productController.js";

const router = express.Router();

// Upload product
router.post("/upload", authenticate, upload.array("images", 5), uploadProduct);

// Get all products
router.get("/", getAllProducts);

// Seller dashboard products
router.get("/my-products", authenticate, getMyProducts);

// Products by seller
router.get("/seller/:sellerId", getProductsBySeller);

// --- NEW ROUTE FOR RECOMMENDATIONS ---
// 2. Add this BEFORE the /:id route to avoid conflicts
router.get("/recommendations/:purchasedProductId", getProductRecommendations);

// Mark as sold -> Notify admin
router.post("/inform-sold", authenticate, informSold);

// Get product by ID (dynamic route last)
router.get("/:id", getProductById);


export default router;
