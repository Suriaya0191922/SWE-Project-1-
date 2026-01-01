// src/server.js
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export { app };  // EXPORT APP FIRST for tests

let io, connectedUsers, httpServer;

if (process.env.NODE_ENV !== "test") {
  // Only run in development/production
  httpServer = createServer(app);
  
  io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  connectedUsers = new Map();

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);
    connectedUsers.set(socket.userId, socket.id);
    socket.join(`user:${socket.userId}`);
    socket.broadcast.emit("user:online", { userId: socket.userId });

    socket.on("typing:start", ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit("typing:started", { userId: socket.userId });
    });
    socket.on("typing:stop", ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit("typing:stopped", { userId: socket.userId });
    });
    socket.on("message:read", ({ senderId, messageIds }) => {
      io.to(`user:${senderId}`).emit("message:read", { messageIds, readBy: socket.userId });
    });
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      connectedUsers.delete(socket.userId);
      socket.broadcast.emit("user:offline", { userId: socket.userId });
    });
  });

  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
    console.log(`WebSocket server ready`);
  });
}

export { io, connectedUsers, httpServer };
