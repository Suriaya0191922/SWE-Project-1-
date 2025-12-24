import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------- UPLOAD PRODUCT ----------
export const uploadProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      condition,
      price,
      description,
    } = req.body;

    const sellerId = req.user.id; // ✅ FROM JWT

    if (!productName || !category || !condition || !price) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "At least one product image is required",
      });
    }

    // ✅ ensure seller role
    if (req.user.role !== "seller") {
      return res.status(403).json({
        message: "Only sellers can upload products",
      });
    }

    const product = await prisma.product.create({
      data: {
        productName,
        category,
        condition,
        price: Number(price),
        description,
        sellerId,
        images: {
          create: req.files.map((file) => ({
            imageUrl: file.filename,
          })),
        },
      },
      include: { images: true },
    });

    res.status(201).json({
      message: "Product uploaded successfully",
      product,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ---------- GET ALL PRODUCTS ----------
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(products);
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ---------- GET PRODUCTS BY SELLER ----------
export const getProductsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await prisma.user.findUnique({
      where: { id: Number(sellerId) },
    });

    if (!seller || seller.role !== "seller") {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    const products = await prisma.product.findMany({
      where: {
        sellerId: Number(sellerId),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: true,
      },
    });

    res.json(products);
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ---------- GET MY PRODUCTS (SELLER DASHBOARD) ----------
export const getMyProducts = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        message: "Only sellers can access this resource",
      });
    }

    const sellerId = req.user.id;

    const products = await prisma.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: "desc" },
      include: { images: true },
    });

    res.json(products);
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
// ---------- GET SINGLE PRODUCT (WITH SELLER DETAILS) ----------
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // GUARD 1: Prevent NaN/undefined crash
    // This is the most important fix for your "App Crashed" loop
    const productId = Number(id);
    if (!id || isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID provided" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: { 
          select: { id: true, name: true, username: true }
        },
        images: true
      }
    });

    // GUARD 2: Check if product actually exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (e) {
    console.error("Error in getProductById:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};