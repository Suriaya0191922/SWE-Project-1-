import express from "express";
import multer from "multer";
// Add updateMe here in the curly braces 👇
import { signup, login, getMe, updateMe } from "../controllers/authController.js"; 
import { upload } from "../middlewares/upload.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 * post:
 * summary: User Signup
 * tags:
 * - Auth
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * name: { type: string }
 * username: { type: string }
 * email: { type: string }
 * password: { type: string }
 * phone: { type: string }
 * address: { type: string }
 * role: { type: string }
 * preferredCategory: { type: string }
 * profileImage: { type: string, format: binary }
 * responses:
 * 200:
 * description: Signup successful
 */
router.post("/signup", upload.single("profileImage"), signup);

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: User Login
 * tags:
 * - Auth
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email: { type: string }
 * password: { type: string }
 * role: { type: string }
 * responses:
 * 200:
 * description: Login successful
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/me:
 * get:
 * summary: Get Current User
 * tags:
 * - Auth
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Successful retrieval of user profile
 */
router.get("/me", authenticate, getMe);

/**
 * @swagger
 * /api/auth/me:
 * put:
 * summary: Update Current User
 * tags:
 * - Auth
 * security:
 * - bearerAuth: []
 * requestBody:
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * name: { type: string }
 * phone: { type: string }
 * address: { type: string }
 * preferredCategory: { type: string }
 * profileImage: { type: string, format: binary }
 * responses:
 * 200:
 * description: Profile updated successfully
 */
router.put("/me", authenticate, upload.single("profileImage"), updateMe);

export default router;