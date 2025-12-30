// backend/src/middlewares/adminAuth.js
import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Admin token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access denied" });
    }

    // ADD THIS LINE so the controller knows who is logged in
    req.user = decoded; 

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid admin token" });
  }
};