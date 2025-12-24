import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------- ADD TO CART ----------
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Only buyers can add to cart" });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if already in cart
    const existingCartItem = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: Number(productId),
        },
      },
    });

    if (existingCartItem) {
      // Update quantity
      const updatedItem = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + Number(quantity) },
        include: { product: { include: { images: true, seller: true } } },
      });
      return res.json({ message: "Cart updated", cartItem: updatedItem });
    } else {
      // Add new item
      const cartItem = await prisma.cart.create({
        data: {
          userId,
          productId: Number(productId),
          quantity: Number(quantity),
        },
        include: { product: { include: { images: true, seller: true } } },
      });
      return res.json({ message: "Added to cart", cartItem });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- GET CART ----------
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Only buyers can view cart" });
    }

    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: true,
            seller: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(cartItems);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- UPDATE CART ITEM ----------
export const updateCartItem = async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;
    const userId = req.user.id;

    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Only buyers can update cart" });
    }

    if (quantity <= 0) {
      // Remove item
      await prisma.cart.delete({
        where: { id: Number(cartItemId), userId },
      });
      return res.json({ message: "Item removed from cart" });
    }

    const updatedItem = await prisma.cart.update({
      where: { id: Number(cartItemId), userId },
      data: { quantity: Number(quantity) },
      include: { product: { include: { images: true, seller: true } } },
    });

    res.json({ message: "Cart updated", cartItem: updatedItem });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- REMOVE FROM CART ----------
export const removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const userId = req.user.id;

    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Only buyers can remove from cart" });
    }

    await prisma.cart.delete({
      where: { id: Number(cartItemId), userId },
    });

    res.json({ message: "Item removed from cart" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};