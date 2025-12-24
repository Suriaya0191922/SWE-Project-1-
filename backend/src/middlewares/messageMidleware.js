import express from "express";
import { authenticate } from "../middleware/authMiddleware.js"; // Import it here
import { getMessages, sendMessage, getConversation } from "../controllers/messageController.js";

const router = express.Router();

// Apply 'authenticate' to all routes below
router.get("/", authenticate, getMessages); 
router.post("/", authenticate, sendMessage);
router.get("/conversation/:id", authenticate, getConversation);

export default router;