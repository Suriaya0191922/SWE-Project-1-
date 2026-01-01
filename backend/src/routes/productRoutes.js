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

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The Product API
 */

/**
 * @swagger
 * /api/products/upload:
 *   post:
 *     summary: Upload a new product
 *     description: Allows an authenticated user to upload a new product with images.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               productName:
 *                 type: string
 *                 description: The name of the product
 *               category:
 *                 type: string
 *               condition:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product successfully uploaded
 *       400:
 *         description: Bad request (e.g., invalid data or missing fields)
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.post("/upload", authenticate, upload.array("images", 5), uploadProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Fetch all the available products.
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   productName:
 *                     type: string
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No products found
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/products/my-products:
 *   get:
 *     summary: Get products uploaded by the authenticated user
 *     description: Fetch all products uploaded by the authenticated user (seller).
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products uploaded by the authenticated user
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.get("/my-products", authenticate, getMyProducts);

/**
 * @swagger
 * /api/products/seller/{sellerId}:
 *   get:
 *     summary: Get products by a specific seller
 *     description: Fetch all products uploaded by a particular seller based on their `sellerId`.
 *     tags: [Products]
 *     parameters:
 *       - name: sellerId
 *         in: path
 *         required: true
 *         description: The ID of the seller whose products you want to fetch.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of products uploaded by the specified seller
 *       404:
 *         description: Seller not found
 */
router.get("/seller/:sellerId", getProductsBySeller);

/**
 * @swagger
 * /api/products/recommendations/{purchasedProductId}:
 *   get:
 *     summary: Get product recommendations based on a purchased product
 *     description: Fetch product recommendations based on the given product ID that was previously purchased.
 *     tags: [Products]
 *     parameters:
 *       - name: purchasedProductId
 *         in: path
 *         required: true
 *         description: The product ID for which you want to get recommendations.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of recommended products
 *       404:
 *         description: Product not found
 */
router.get("/recommendations/:purchasedProductId", getProductRecommendations);

/**
 * @swagger
 * /api/products/inform-sold:
 *   post:
 *     summary: Mark a product as sold and notify admin
 *     description: Allows the seller to mark a product as sold and notify the admin.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product successfully marked as sold and admin notified
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.post("/inform-sold", authenticate, informSold);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a specific product by ID
 *     description: Fetch a product's details by its ID.
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product you want to fetch.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The product details
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);

export default router;
