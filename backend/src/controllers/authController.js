import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const signup = async (req, res) => {
  try {
    console.log("📝 Signup attempt:", req.body);
    console.log("📎 File uploaded:", req.file);
    
    let {
      name,
      username,
      email,
      password,
      phone,
      address,
      role,
      preferredCategory,
    } = req.body;

    console.log("✅ Step 1: Received data");

    email = email.toLowerCase();

    console.log("✅ Step 2: Email normalized to:", email);

    if (role === "seller") {
      const allowedDomains = [
        "@student.cuet.ac.bd",
        "@cuet.ac.bd",
      ];
      const isAllowed = allowedDomains.some(domain =>
        email.endsWith(domain)
      );
      if (!isAllowed) {
        return res.status(400).json({
          message:
            "Seller email must end with @student.cuet.ac.bd or @cuet.ac.bd",
        });
      }
    }

    console.log("✅ Step 3: Email validation passed");

    console.log("🔍 Checking if user exists...");
    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        role,
      },
    });
    
    if (existingEmail) {
      return res.status(400).json({
        message: `Email already registered as ${role}`,
      });
    }

    const existingUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already taken",
      });
    }

    console.log("✅ Step 4: Database check completed. Existing user: null");

    console.log("🔐 Hashing password...");
    const hashed = await bcrypt.hash(password, 10);
    console.log("✅ Step 5: Password hashed");

    const profileImage = req.file ? req.file.filename : null;
    console.log("✅ Step 6: Profile image:", profileImage);

    console.log("💾 Creating user in database...");
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashed,
        phone,
        address,
        role,
        preferredCategory,
        profileImage,
      },
    });

    console.log("✅ Step 7: User created successfully!");

    res.json({ message: "Signup successful", user });
  } catch (e) {
    console.error("❌ Signup Error at some step:");
    console.error("Error name:", e.name);
    console.error("Error message:", e.message);
    console.error("Full error:", e);
    res.status(500).json({ 
      message: "Internal server error",
      error: e.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        role,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Login successful", token });
  } catch (e) {
    console.error("Login Error:", e);
    res.status(500).json({ message: "Internal server error", error: e.message });
  }
};

export const getMe = async (req, res) => {
  try {
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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (e) {
    console.error("GetMe Error:", e);
    res.status(500).json({ message: "Internal server error", error: e.message });
  }
};
// Example check for your controller
export const updateMe = async (req, res) => {
  try {
    // Convert ID to Number if your Prisma schema uses Int
    const userId = Number(req.user.id); 

    const { name, phone, address, preferredCategory } = req.body;

    // Build update object only with fields that are provided
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (preferredCategory) updateData.preferredCategory = preferredCategory;

    // Handle profile image from multer
    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    console.log("Updating User ID:", userId, "with data:", updateData);

    const updatedUser = await prisma.user.update({
      where: { id: userId }, 
      data: updateData,
    });

    res.json({ message: "Update successful", user: updatedUser });
  } catch (e) {
    console.error("❌ Update Error:", e.message);
    res.status(500).json({ 
      message: "Internal server error", 
      error: e.message 
    });
  }
};