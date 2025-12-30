import express from "express";
import { adminAuth } from "../middlewares/adminAuth.js"; 
import { sellerAuth } from "../middlewares/sellerAuth.js"; 
import { 
  adminLogin, 
  getBuyers, 
  getSellers, 
  getProducts, 
  updateProductStatus,
  getSoldItems, 
  deleteUser, 
  deleteProduct,
  informAdmin,
  getNotifications,
  getSalesStats // <--- NEW: Import this
} from "../controllers/adminController.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.post("/login", adminLogin);

// --- PROTECTED ADMIN ROUTES ---
router.get("/dashboard", adminAuth, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.get("/buyers", adminAuth, getBuyers);
router.delete("/buyers/:id", adminAuth, deleteUser);
router.get("/sellers", adminAuth, getSellers);
router.delete("/sellers/:id", adminAuth, deleteUser);
router.get("/products", adminAuth, getProducts);
router.delete("/products/:id", adminAuth, deleteProduct);
router.patch("/products/:id/status", adminAuth, updateProductStatus);
router.get("/sold-items", adminAuth, getSoldItems);

// --- NEW: SALES ANALYTICS ROUTE ---
router.get("/sales-stats", adminAuth, getSalesStats);

// --- NOTIFICATION SYSTEM ---
router.post("/inform", sellerAuth, informAdmin);
router.get("/notifications", adminAuth, getNotifications);

export default router;