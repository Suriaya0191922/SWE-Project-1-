import express from "express";
import { adminAuth } from "../middlewares/adminAuth.js"; 
import { sellerAuth } from "../middlewares/sellerAuth.js"; 
import { 
  adminLogin, 
  getBuyers, 
  getSellers, 
  getProducts, 
  updateProductStatus,
  getSoldItems, 
  deleteUser, 
  deleteProduct,
  informAdmin,
  getNotifications,
  getSalesStats, // <--- NEW: Import this
  deleteNotification
} from "../controllers/adminController.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin Login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", adminLogin);

// --- PROTECTED ADMIN ROUTES ---
/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Admin Dashboard
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome Admin message
 *       401:
 *         description: Unauthorized access
 */
router.get("/dashboard", adminAuth, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

/**
 * @swagger
 * /api/admin/buyers:
 *   get:
 *     summary: Get list of all buyers
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of buyers
 *       401:
 *         description: Unauthorized access
 */
router.get("/buyers", adminAuth, getBuyers);

/**
 * @swagger
 * /api/admin/buyers/{id}:
 *   delete:
 *     summary: Delete a buyer by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the buyer to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Buyer successfully deleted
 *       404:
 *         description: Buyer not found
 *       401:
 *         description: Unauthorized access
 */
router.delete("/buyers/:id", adminAuth, deleteUser);

/**
 * @swagger
 * /api/admin/sellers:
 *   get:
 *     summary: Get list of all sellers
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sellers
 *       401:
 *         description: Unauthorized access
 */
router.get("/sellers", adminAuth, getSellers);

/**
 * @swagger
 * /api/admin/sellers/{id}:
 *   delete:
 *     summary: Delete a seller by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the seller to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Seller successfully deleted
 *       404:
 *         description: Seller not found
 *       401:
 *         description: Unauthorized access
 */
router.delete("/sellers/:id", adminAuth, deleteUser);

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     summary: Get list of all products
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all products
 *       401:
 *         description: Unauthorized access
 */
router.get("/products", adminAuth, getProducts);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product successfully deleted
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized access
 */
router.delete("/products/:id", adminAuth, deleteProduct);

/**
 * @swagger
 * /api/admin/products/{id}/status:
 *   patch:
 *     summary: Update product status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to update
 *         schema:
 *           type: integer
 *       - in: body
 *         name: status
 *         required: true
 *         description: The new status of the product
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               description: New product status (e.g., "sold", "available")
 *     responses:
 *       200:
 *         description: Product status successfully updated
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized access
 */
router.patch("/products/:id/status", adminAuth, updateProductStatus);

/**
 * @swagger
 * /api/admin/sold-items:
 *   get:
 *     summary: Get sold items
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sold items
 *       401:
 *         description: Unauthorized access
 */
router.get("/sold-items", adminAuth, getSoldItems);

// --- NEW: SALES ANALYTICS ROUTE ---
/**
 * @swagger
 * /api/admin/sales-stats:
 *   get:
 *     summary: Get sales statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales statistics retrieved successfully
 *       401:
 *         description: Unauthorized access
 */
router.get("/sales-stats", adminAuth, getSalesStats);

// --- NOTIFICATION SYSTEM ---
/**
 * @swagger
 * /api/admin/notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *       401:
 *         description: Unauthorized access
 */
router.get("/notifications", adminAuth, getNotifications);

/**
 * @swagger
 * /api/admin/notifications/{id}:
 *   delete:
 *     summary: Delete a notification by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the notification to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notification successfully deleted
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Unauthorized access
 */
router.delete("/notifications/:id", adminAuth, deleteNotification);

// --- NOTIFY ADMIN (Seller Action) ---
/**
 * @swagger
 * /api/admin/inform:
 *   post:
 *     summary: Inform admin (by seller)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification sent to admin successfully
 *       401:
 *         description: Unauthorized access
 */
router.post("/inform", sellerAuth, informAdmin);

export default router;
