import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all wishlist items
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: { images: true }
        }
      }
    });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const newItem = await prisma.wishlist.upsert({
      where: {
        userId_productId: { 
          userId, 
          productId: parseInt(productId) 
        }
      },
      update: {}, 
      create: {
        userId,
        productId: parseInt(productId)
      }
    });

    res.status(201).json({ success: true, message: "Added to wishlist ❤️", newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.wishlist.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};