import express from "express";
import cors from "cors";
import { swaggerUi, swaggerSpec } from "./swagger.js";  // FIXED: Use your corrected swagger.js

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import simpleRoute from './routes/simpleRoute.js';

const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));

// ================= SWAGGER =================  // FIXED: Mounted BEFORE routes, correct spec
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ================= STATIC =================
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/simple", simpleRoute);

// ================= GLOBAL ERROR HANDLER (MUST BE LAST) =================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  // Multer-specific errors
  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
