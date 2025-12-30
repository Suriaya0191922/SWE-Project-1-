import { PrismaClient } from "@prisma/client";
import { io, connectedUsers } from "../server.js"; // Import WebSocket instance

const prisma = new PrismaClient();

// ---------- SEND MESSAGE ----------
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, productId } = req.body;
    const senderId = Number(req.user.id);

    // GUARD: Ensure IDs are numbers and content exists
    if (!content || !receiverId || isNaN(Number(receiverId))) {
      return res.status(400).json({ message: "Valid Receiver and content are required" });
    }

    // 1. Check receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: Number(receiverId) },
    });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // 2. Create the message
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId: Number(receiverId),
        productId: productId && !isNaN(Number(productId)) ? Number(productId) : null,
        content: content.trim(),
      },
      include: {
        sender: { select: { id: true, name: true, username: true } },
        receiver: { select: { id: true, name: true, username: true } },
        product: { select: { id: true, productName: true, images: true } },
      },
    });

    // 3. Emit real-time message via WebSocket
    const receiverSocketId = connectedUsers.get(Number(receiverId));
    if (receiverSocketId) {
      io.to(`user:${receiverId}`).emit("message:new", {
        message,
        conversationUpdated: true,
      });
    }

    io.to(`user:${senderId}`).emit("message:sent", {
      message,
    });

    res.status(201).json({ message: "Message sent", data: message });
  } catch (e) {
    console.error("Error in sendMessage:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- GET MY MESSAGES (INBOX LIST) ----------
export const getMyMessages = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    
    if (isNaN(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, name: true, username: true } },
        receiver: { select: { id: true, name: true, username: true } },
        product: { select: { id: true, productName: true, images: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(messages);
  } catch (e) {
    console.error("Error in getMyMessages:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- GET CONVERSATION WITH USER ----------
export const getConversation = async (req, res) => {
  try {
    const otherUserId = Number(req.params.otherUserId);
    const userId = Number(req.user.id);
    
    // GUARD: Prevent Prisma crash on invalid otherUserId
    if (isNaN(otherUserId)) {
      return res.status(400).json({ message: "Invalid other user ID" });
    }

    const productIdParam = req.query.productId;
    const productId = (productIdParam && productIdParam !== 'undefined' && !isNaN(Number(productIdParam))) 
      ? Number(productIdParam) 
      : null;

    // 1. Mark incoming messages as read
    const readWhere = {
      senderId: otherUserId,
      receiverId: userId,
      isRead: false,
    };
    if (productId) readWhere.productId = productId;
    
    const updatedMessages = await prisma.message.updateMany({
      where: readWhere,
      data: { isRead: true },
    });

    // 2. Notify sender
    if (updatedMessages.count > 0) {
      io.to(`user:${otherUserId}`).emit("messages:read", {
        readBy: userId,
        count: updatedMessages.count,
      });
    }

    // 3. Fetch the conversation
    const whereClause = {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    };
    if (productId) whereClause.productId = productId;
    
    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: { select: { id: true, name: true, username: true } },
        receiver: { select: { id: true, name: true, username: true } },
        product: { select: { id: true, productName: true, images: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(messages);
  } catch (e) {
    console.error("Error in getConversation:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- MARK MESSAGE AS READ ----------
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = Number(req.user.id);
    const parsedMessageId = Number(messageId);

    if (isNaN(parsedMessageId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const message = await prisma.message.findFirst({
      where: {
        id: parsedMessageId,
        receiverId: userId,
      },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const updatedMessage = await prisma.message.update({
      where: { id: parsedMessageId },
      data: { isRead: true },
      include: {
        sender: { select: { id: true, name: true, username: true } },
        receiver: { select: { id: true, name: true, username: true } },
      },
    });

    io.to(`user:${message.senderId}`).emit("message:read", {
      messageId: updatedMessage.id,
      readBy: userId,
    });

    res.json({ message: "Message marked as read", data: updatedMessage });
  } catch (e) {
    console.error("Error in markAsRead:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};