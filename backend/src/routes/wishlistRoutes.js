import express from "express";
import { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist 
} from "../controllers/wishlistController.js";

// Ekhane 'authenticateToken' er bodole 'authenticate' likhun
import { authenticate } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

// Middleware hishebe 'authenticate' function-ti use korun
router.get("/", authenticate, getWishlist);
router.post("/", authenticate, addToWishlist);
router.delete("/:id", authenticate, removeFromWishlist);

export default router;