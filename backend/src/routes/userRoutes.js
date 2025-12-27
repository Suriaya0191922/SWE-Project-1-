import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../prismaClient.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

/* ===========================
   GET CURRENT USER (Profile)
=========================== */
router.get("/", authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      preferredCategory: true,
      profileImage: true,
      createdAt: true,
    },
  });

  res.json(user);
});

/* ===========================
   UPDATE PROFILE (Edit Profile)
=========================== */
router.put(
  "/update-profile",
  authenticate,
  upload.single("profileImage"),
  async (req, res) => {
    const { name, phone, address, preferredCategory } = req.body;

    const data = {
      name,
      phone,
      address,
      preferredCategory,
    };

    if (req.file) {
      data.profileImage = req.file.filename; // SAME as signup
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data,
    });

    res.json({ message: "Profile updated successfully" });
  }
);

/* ===========================
   CHANGE PASSWORD (Settings)
=========================== */
router.put("/password", authenticate, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Old password incorrect" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashed },
  });

  res.json({ message: "Password updated successfully" });
});

/* ===========================
   DELETE ACCOUNT (Settings)
=========================== */
router.delete("/", authenticate, async (req, res) => {
  await prisma.user.delete({
    where: { id: req.user.id },
  });

  res.json({ message: "Account deleted" });
});

// In your userRoutes.js or relevant routes file
router.get("/buyers", authenticate, async (req, res) => {
  try {
    const buyers = await prisma.user.findMany({
      where: { role: "buyer" }, // Assuming role is 'buyer'
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        preferredCategory: true,
        profileImage: true,
        createdAt: true,
      },
    });
    res.json(buyers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch buyers" });
  }
});

router.get("/sellers", authenticate, async (req, res) => {
  try {
    const sellers = await prisma.user.findMany({
      where: { role: "seller" }, // Assuming role is 'seller'
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        preferredCategory: true,
        profileImage: true,
        createdAt: true,
      },
    });
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sellers" });
  }
});
export default router;
