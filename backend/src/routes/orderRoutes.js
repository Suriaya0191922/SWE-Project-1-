import express from "express";
import { placeOrder, getMyOrders, getOrderById } from "../controllers/orderController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: The Orders API
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place an order from the cart
 *     description: Place an order based on the items in the user's cart.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Bad request (e.g., cart is empty or invalid data)
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.post("/", placeOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user's orders
 *     description: Fetch all orders placed by the authenticated user.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders placed by the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   totalAmount:
 *                     type: number
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.get("/", getMyOrders);

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get order details by ID
 *     description: Fetch detailed information for a specific order by its ID.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: The ID of the order you want to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detailed information for the requested order
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.get("/:orderId", getOrderById);

export default router;
