import express from "express";
import { upload } from "../middlewares/upload.js";
import { authenticate } from "../middlewares/authMiddleware.js";

import {
  uploadProduct,
  getAllProducts,
  getMyProducts,
  getProductsBySeller,
  getProductById, // <--- Add this
} from "../controllers/productController.js";

const router = express.Router();

// 1. Static/Specific Routes first
router.post("/upload", authenticate, upload.array("images", 5), uploadProduct);
router.get("/", getAllProducts);

// Move "my-products" ABOVE the "/:id" route
router.get("/my-products", authenticate, getMyProducts);

// Public/seller view
router.get("/seller/:sellerId", getProductsBySeller);

// 2. Dynamic/Parameter Routes LAST
// This acts as a "catch-all" for any remaining GET requests
router.get("/:id", getProductById); 

export default router;