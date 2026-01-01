import express from "express";
import { sendMessage, getMyMessages, getConversation, markAsRead } from "../controllers/messageController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: The Messages API
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message
 *     description: Allows the authenticated user to send a message to another user.
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
 *                 description: ID of the recipient user
 *               content:
 *                 type: string
 *                 description: The message content
 *     responses:
 *       201:
 *         description: Message successfully sent
 *       400:
 *         description: Bad request (invalid input)
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.post("/", sendMessage);

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get user's messages
 *     description: Retrieve all messages for the authenticated user.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   senderId:
 *                     type: integer
 *                   receiverId:
 *                     type: integer
 *                   content:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.get("/", getMyMessages);

/**
 * @swagger
 * /api/messages/conversation/{otherUserId}:
 *   get:
 *     summary: Get conversation with another user
 *     description: Retrieve all messages exchanged between the authenticated user and another user.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: otherUserId
 *         required: true
 *         description: The ID of the other user to get the conversation with
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of messages in the conversation
 *       404:
 *         description: Conversation not found
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.get("/conversation/:otherUserId", getConversation);

/**
 * @swagger
 * /api/messages/{messageId}/read:
 *   put:
 *     summary: Mark message as read
 *     description: Allows the authenticated user to mark a specific message as read.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         description: The ID of the message to mark as read
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Message successfully marked as read
 *       404:
 *         description: Message not found
 *       401:
 *         description: Unauthorized access (token is required)
 */
router.put("/:messageId/read", markAsRead);

export default router;
