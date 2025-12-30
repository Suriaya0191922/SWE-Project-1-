import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ---------- PLACE ORDER (With Automatic Status Update) ----------
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role !== "buyer") {
      return res.status(403).json({ message: "Only buyers can place orders" });
    }

    // 1. Fetch Cart Items with Product details
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Transaction babohar kora hoyeche jate Order create o Status update eksathe hoy
    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      
      const orderItemsData = cartItems.map((item) => {
        totalAmount += Number(item.product.price) * item.quantity;
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        };
      });

      // 2. Create the Order
      const order = await tx.order.create({
        data: {
          buyerId: userId,
          totalAmount,
          items: {
            create: orderItemsData,
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

      // 3. Update Product Status to "Sold" (Capital 'S' to match your Admin Panel)
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { status: "Sold" }, // Updated from "sold" to "Sold"
        });
      }

      // 4. Clear the Buyer's Cart
      await tx.cart.deleteMany({ where: { userId } });

      return order;
    });

    res.status(201).json({ 
      message: "Order placed and products marked as Sold successfully! 🎉", 
      order: result 
    });
  } catch (e) {
    console.error("Order Error:", e);
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
    console.error("Fetch Orders Error:", e);
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
    console.error("Fetch Order ID Error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};