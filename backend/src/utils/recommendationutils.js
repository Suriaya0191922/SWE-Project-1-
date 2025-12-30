// CHANGE THIS: import { PrismaClient } from "@prisma/client";
// TO THIS:
import prisma from "../prismaClient.js"; 

/**
 * Fetches products in the same category to show as "Related Items"
 */
export const suggestRelatedProducts = async (purchasedProductId) => {
  try {
    // Now 'prisma' is defined because of the import above
    const product = await prisma.product.findUnique({
      where: { id: purchasedProductId },
      select: { category: true },
    });

    if (!product) return [];

    const { category } = product;

    const relatedProducts = await prisma.product.findMany({
      where: {
        category: category,
        NOT: { id: purchasedProductId },
      },
      orderBy: { createdAt: "desc" },
      include: { images: true },
      take: 4, 
    });

    return relatedProducts;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};

/**
 * Helper to get just the category name for the LLM prompt
 */
export const getProductCategory = async (productId) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { category: true }
    });
    return product ? product.category : "General Engineering";
  } catch (error) {
    return "General Engineering";
  }
};