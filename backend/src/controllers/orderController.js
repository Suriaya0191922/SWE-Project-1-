import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------- PLACE ORDER ----------
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Only buyers can place orders" });
    }

    // Get cart items
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = cartItems.map((item) => {
      totalAmount += Number(item.product.price) * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        buyerId: userId,
        totalAmount,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                seller: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
    });

    // Clear cart
    await prisma.cart.deleteMany({
      where: { userId },
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- GET MY ORDERS ----------
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Only buyers can view orders" });
    }

    const orders = await prisma.order.findMany({
      where: { buyerId: userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                seller: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- GET ORDER BY ID ----------
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: {
        id: Number(orderId),
        buyerId: userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                seller: { select: { id: true, name: true, email: true } },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};