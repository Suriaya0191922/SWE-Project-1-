import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// --- ADMIN LOGIN ---
export const adminLogin = async (req, res) => {
  const { password } = req.body;
  const validPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password !== validPassword) {
    return res.status(401).json({ success: false, message: "Invalid admin password" });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ success: true, token });
};

// --- BUYERS MANAGEMENT ---
export const getBuyers = async (req, res) => {
  try {
    const buyers = await prisma.user.findMany({
      where: { role: "buyer" },
      select: { id: true, name: true, email: true, createdAt: true, address: true }
    });
    res.json(buyers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching buyers" });
  }
};

// --- SELLERS MANAGEMENT ---
export const getSellers = async (req, res) => {
  try {
    const sellers = await prisma.user.findMany({
      where: { role: "seller" },
      include: { 
        _count: { select: { products: true } } 
      }
    });
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sellers" });
  }
};

// --- PRODUCTS MANAGEMENT ---
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { seller: { select: { name: true } } },
      orderBy: { createdAt: "desc" }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// --- UPDATE PRODUCT STATUS ---
export const updateProductStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 

  try {
    const productId = parseInt(id);

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // UPDATED LOGIC:
    // We remove the strict 'if not pending' check. 
    // This allows the Admin Panel to show the current status (even if 'sold') 
    // while still allowing the Admin to manually move items between Active/Pending.
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { status: status },
    });

    res.json({ success: true, message: `Status updated to ${status}`, product: updatedProduct });
  } catch (err) {
    console.error("ADMIN STATUS UPDATE ERROR:", err);
    res.status(500).json({ message: "Database Error: " + err.message });
  }
};

// --- SALES HISTORY ---
export const getSoldItems = async (req, res) => {
  try {
    const soldItems = await prisma.orderItem.findMany({
      include: {
        product: {
          include: { seller: { select: { name: true } } }
        },
        order: {
          include: {
            buyer: { select: { name: true, email: true } }
          }
        }
      },
      orderBy: { id: 'desc' }
    });
    res.json(soldItems);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sales history" });
  }
};

// --- SALES STATS ---
export const getSalesStats = async (req, res) => {
  try {
    const soldItems = await prisma.orderItem.findMany({
      select: { price: true, createdAt: true }
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const statsMap = months.map(month => ({ name: month, revenue: 0 }));

    soldItems.forEach(item => {
      const monthIndex = new Date(item.createdAt).getMonth();
      statsMap[monthIndex].revenue += Number(item.price);
    });

    res.status(200).json(statsMap);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

// --- DELETE HANDLERS ---
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: "User removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: "Product removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

// --- NOTIFICATIONS ---
export const informAdmin = async (req, res) => {
  const { subject, message } = req.body;
  try {
    await prisma.notification.create({
      data: {
        message: `Subject: ${subject} | Message: ${message}`,
        userId: req.user.id,
        isRead: false,
      },
    });
    res.status(201).json({ success: true, message: "Admin has been notified successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send notification." });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications." });
  }
};