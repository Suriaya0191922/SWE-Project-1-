import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// ---------- SIGNUP ----------
export const signup = async (req, res) => {
  try {
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

    // ✅ Normalize email (recommended)
    email = email.toLowerCase();

    // ✅ SELLER EMAIL DOMAIN VALIDATION
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

    // ✅ CHECK UNIQUE (email + role)
    const existing = await prisma.user.findFirst({
      where: {
        email,
        role,
      },
    });

    if (existing) {
      return res.status(400).json({
        message: `Email already registered as ${role}`,
      });
    }

    // ✅ PASSWORD HASH
    const hashed = await bcrypt.hash(password, 10);

    const profileImage = req.file ? req.file.filename : null;

    // ✅ CREATE USER
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

    res.json({ message: "Signup successful", user });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- LOGIN ----------
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        email,
        role,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
