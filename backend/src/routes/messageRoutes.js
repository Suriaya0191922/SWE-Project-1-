import express from "express";
import { sendMessage, getMyMessages, getConversation, markAsRead } from "../controllers/messageController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverId:
 *                 type: integer
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post("/", sendMessage);

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get user's messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Messages retrieved
 */
router.get("/", async (req, res, next) => {
  console.log("Fetching messages for user:", req.user.id);
  try {
    await getMyMessages(req, res, next);
  } catch (error) {
    console.error("Error in getMyMessages:", error);
    next(error);
  }
});

/**
 * @swagger
 * /api/messages/conversation/{otherUserId}:
 *   get:
 *     summary: Get conversation with another user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: otherUserId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Conversation messages
 */
router.get("/conversation/:otherUserId", getConversation);

/**
 * @swagger
 * /api/messages/{messageId}/read:
 *   put:
 *     summary: Mark message as read
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message marked as read
 */
router.put("/:messageId/read", markAsRead);

export default router;