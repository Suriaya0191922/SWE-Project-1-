import express from "express";
import { signup, login } from "../controllers/authController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/signup", upload.single("profileImage"), signup);
router.post("/login", login);

export default router;
