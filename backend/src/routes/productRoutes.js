import express from "express";
import { upload } from "../middlewares/upload.js";
import { authenticate } from "../middlewares/authMiddleware.js";

import {
  uploadProduct,
  getAllProducts,
  getMyProducts,
  getProductsBySeller,
} from "../controllers/productController.js";

const router = express.Router();

/**
 * @swagger
 * /api/products/upload:
 *   post:
 *     summary: Upload a new product
 *     description: Allows a seller to upload a product with multiple images.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - category
 *               - condition
 *               - price
 *               - images
 *             properties:
 *               productName:
 *                 type: string
 *               category:
 *                 type: string
 *               condition:
 *                 type: string
 *                 example: Good
 *               price:
 *                 type: number
 *                 example: 450
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product uploaded successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only sellers can upload products
 */
router.post(
  "/upload",
  authenticate,
  upload.array("images", 5),
  uploadProduct
);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieves all uploaded products.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", getAllProducts);
// Seller dashboard (JWT)
router.get("/my-products", authenticate, getMyProducts);

// Public/admin view
router.get("/seller/:sellerId", getProductsBySeller);

export default router;
