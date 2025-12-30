import { PrismaClient } from "@prisma/client";
import { getRecommendationWithFailover } from "../utils/llmIntegration.js";
import { suggestRelatedProducts } from "../utils/recommendationutils.js";

const prisma = new PrismaClient();

// ---------- UPLOAD PRODUCT ----------
export const uploadProduct = async (req, res) => {
  try {
    const { productName, category, condition, price, description } = req.body;
    const sellerId = Number(req.user.id);

    if (!productName || !category || !condition || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one product image is required" });
    }

    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can upload products" });
    }

    const product = await prisma.product.create({
      data: {
        productName,
        category,
        condition,
        price: Number(price),
        description,
        sellerId,
        // Status manually deyar dorkar nei, Prisma automatic "pending" set korbe
        images: {
          create: req.files.map((file) => ({
            imageUrl: file.filename,
          })),
        },
      },
      include: { images: true },
    });

    res.status(201).json({ message: "Product uploaded successfully! (Pending Approval)", product });
  } catch (e) {
    console.error("Upload Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- GET ALL PRODUCTS (Buyers see everything) ----------
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        seller: { select: { id: true, name: true, email: true } },
      },
    });
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- GET PRODUCTS BY SELLER ----------
export const getProductsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const sId = Number(sellerId);

    const products = await prisma.product.findMany({
      where: { sellerId: sId },
      orderBy: { createdAt: "desc" },
      include: { images: true },
    });
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- GET MY PRODUCTS (SELLER DASHBOARD) ----------
export const getMyProducts = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied" });
    }
    const sellerId = Number(req.user.id);

    const products = await prisma.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: "desc" },
      include: { images: true },
    });
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- GET SINGLE PRODUCT ----------
export const getProductById = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: { select: { id: true, name: true, username: true } },
        images: true,
      },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- DELETE PRODUCT ----------
export const deleteProduct = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const sellerId = Number(req.user.id);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.sellerId !== sellerId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.product.delete({ where: { id: productId } });
    res.json({ message: "Product deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// ---------- INFORM ADMIN THAT PRODUCT IS SOLD ----------
export const informSold = async (req, res) => {
  try {
    const { productId, productName } = req.body;
    const sellerId = Number(req.user.id);
    const pId = Number(productId);

    if (!productId || !productName) {
      return res.status(400).json({ message: "Product ID and Name are required" });
    }

    const existingProduct = await prisma.product.findUnique({ where: { id: pId } });
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return res.status(500).json({ message: "No admin exists in database" });
    }

    const notification = await prisma.notification.create({
      data: {
        sellerId,
        adminId: admin.id,
        productId: pId,
        productName: productName,
        message: `Product Sold: "${productName}" (ID: ${pId}) by Seller ${sellerId}.`,
        isRead: false,
      },
    });

    res.status(201).json({
      success: true,
      message: "Admin has been notified successfully",
      notification,
    });
  } catch (e) {
    console.error("Inform Sold Error:", e);
    res.status(500).json({ message: "Failed to notify admin", error: e.message });
  }
};

// ---------- SEARCH & BROWSE PRODUCTS ----------
export const searchProducts = async (req, res) => {
  try {
    const { search } = req.query;

    const products = await prisma.product.findMany({
      where: search ? {
        productName: { contains: search, mode: 'insensitive' }
      } : {},
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        seller: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(products);
  } catch (e) {
    console.error("Search Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- GET RECOMMENDATIONS ----------
export const getProductRecommendations = async (req, res) => {
  try {
    const { purchasedProductId } = req.params;
    const product = await prisma.product.findUnique({ where: { id: Number(purchasedProductId) } });

    if (!product) return res.status(404).json({ message: "Product not found" });

    const categoryRecommendations = await suggestRelatedProducts(Number(purchasedProductId));

    const availableItems = categoryRecommendations.map(p => p.productName).join(", ");
    const prompt = `You are a study assistant for a student at CUET University. 
    The student just bought a '${product.productName}' in the '${product.category}' category.
    Based on these items available in our campus store: [${availableItems}], 
    recommend the best 2 items they might need for their engineering studies. 
    Keep the answer very short (under 20 words).`;

    const llmRecommendation = await getRecommendationWithFailover(prompt);

    res.json({
      categoryRecommendations,
      llmAdvice: llmRecommendation
    });
  } catch (e) {
    res.status(500).json({ message: "Error", error: e.message });
  }
};