import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
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
    const SECRET = process.env.JWT_SECRET || "mysecretkey";  // moved here!
    const decoded = jwt.verify(token, SECRET);
    // console.log("Decoded:", decoded);  // add this line

    req.user = decoded;
    next();
  }  catch (error: any) {
    console.log("JWT Error:", error.name, error.message);
    return res.status(401).json({ message: error.message });
}
}
