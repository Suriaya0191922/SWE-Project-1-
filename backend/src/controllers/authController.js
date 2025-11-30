import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// ---------- SIGNUP ----------
export const signup = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      phone,
      address,
      role,
      preferredCategory
    } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);

    const profileImage = req.file ? req.file.filename : null;

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
        profileImage
      },
    });

    res.json({ message: "Signup successful", user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ---------- LOGIN ----------
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    if (user.role !== role)
      return res.status(400).json({ message: "Role does not match (buyer/seller)" });

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
