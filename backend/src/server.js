import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import path from "path";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// serve uploaded images
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Backend running at http://localhost:${process.env.PORT}`);
});
