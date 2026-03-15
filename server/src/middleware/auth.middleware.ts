import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

// ⚠️ CRITICAL: JWT_SECRET must be set in environment variables
const SECRET: string = process.env.JWT_SECRET || "";

if (!SECRET) {
  throw new Error(
    "❌ CRITICAL: JWT_SECRET environment variable is not set. Please set it in your .env file.",
  );
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error("🔐 JWT Verification Error:", error.name, error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
