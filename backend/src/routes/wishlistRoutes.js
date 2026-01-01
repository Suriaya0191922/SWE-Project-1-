import express from "express";
import { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist 
} from "../controllers/wishlistController.js";
import { authenticate } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: The Wishlist API
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get the user's wishlist
 *     description: Fetch the products added to the user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of products in the user's wishlist
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
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.get("/", authenticate, getWishlist);

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add a product to the user's wishlist
 *     description: Add a product to the authenticated user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: The ID of the product to add to the wishlist
 *     responses:
 *       201:
 *         description: Product successfully added to the wishlist
 *       400:
 *         description: Bad request (invalid data or missing fields)
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.post("/", authenticate, addToWishlist);

/**
 * @swagger
 * /api/wishlist/{id}:
 *   delete:
 *     summary: Remove a product from the user's wishlist
 *     description: Remove a product from the authenticated user's wishlist by ID
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the product to remove from the wishlist
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product successfully removed from the wishlist
 *       404:
 *         description: Product not found in the wishlist
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.delete("/:id", authenticate, removeFromWishlist);

export default router;
