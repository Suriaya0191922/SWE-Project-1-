import "./cron/cleanupCron.js";
import app from "./app.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";


// Import app AFTER dotenv.config()
// ... rest of the code
dotenv.config();

const PORT = process.env.PORT || 5001;
const httpServer = createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"], // Add your frontend URLs
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store connected users
const connectedUsers = new Map(); // userId -> socketId

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.userId}`);
  
  // Store user's socket connection
  connectedUsers.set(socket.userId, socket.id);

  // Join user's personal room
  socket.join(`user:${socket.userId}`);

  // Notify user is online
  socket.broadcast.emit("user:online", { userId: socket.userId });

  // Handle user typing
  socket.on("typing:start", ({ receiverId }) => {
    io.to(`user:${receiverId}`).emit("typing:started", {
      userId: socket.userId,
    });
  });

  socket.on("typing:stop", ({ receiverId }) => {
    io.to(`user:${receiverId}`).emit("typing:stopped", {
      userId: socket.userId,
    });
  });

  // Handle message read status
  socket.on("message:read", ({ senderId, messageIds }) => {
    io.to(`user:${senderId}`).emit("message:read", {
      messageIds,
      readBy: socket.userId,
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.userId}`);
    connectedUsers.delete(socket.userId);
    socket.broadcast.emit("user:offline", { userId: socket.userId });
  });
});

// Export io instance for use in controllers
export { io, connectedUsers };

httpServer.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  console.log(`WebSocket server ready`);
});

const cors = require('cors');
app.use(cors({
  origin: 'আপনার-vercel-লিঙ্ক.vercel.app' // এখানে আপনার ফ্রন্টএন্ডের লিঙ্ক দিন
}));
