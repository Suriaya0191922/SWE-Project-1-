import express from "express";
import { addToCart, getCart, updateCartItem, removeFromCart } from "../controllers/cartController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: The Cart API
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add product to cart
 *     description: Add a product to the authenticated user's cart with a specified quantity.
 *     tags: [Cart]
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
 *                 description: The ID of the product to add to the cart
 *               quantity:
 *                 type: integer
 *                 default: 1
 *                 description: The quantity of the product to add to the cart
 *     responses:
 *       200:
 *         description: Product successfully added to the cart
 *       400:
 *         description: Bad request (invalid productId or quantity)
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.post("/", addToCart);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     description: Retrieve all items in the authenticated user's cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   productId:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   productName:
 *                     type: string
 *                   price:
 *                     type: number
 *                     format: float
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.get("/", getCart);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update cart item quantity
 *     description: Update the quantity of a product in the cart.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartItemId:
 *                 type: integer
 *                 description: The ID of the cart item to update
 *               quantity:
 *                 type: integer
 *                 description: The new quantity of the product in the cart
 *     responses:
 *       200:
 *         description: Cart item successfully updated
 *       400:
 *         description: Bad request (invalid cartItemId or quantity)
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.put("/update", updateCartItem);

/**
 * @swagger
 * /api/cart/{cartItemId}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove a specific item from the user's cart by cart item ID.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         description: The ID of the cart item to remove
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item successfully removed from cart
 *       404:
 *         description: Cart item not found
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.delete("/:cartItemId", removeFromCart);

export default router;
