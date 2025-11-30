import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// serve uploaded images
app.use("/uploads", express.static("uploads"));

// all routes
app.use("/api/auth", authRoutes);

export default app;
