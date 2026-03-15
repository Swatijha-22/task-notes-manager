import { Request, Response } from "express";
import { signup, login, refreshAccessToken, logout } from "./auth.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { signupSchema, loginSchema, refreshTokenSchema } from "./auth.schema";
import { z } from "zod";

export const signupUser = async (req: Request, res: Response) => {
  try {
    const validated = signupSchema.parse(req.body);
    const { email, password } = validated;

    const user = await signup(email, password);

    res.json({
      message: "User registered",
      user: { email: user.email },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return res.status(400).json({ message: messages });
    }
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);
    const { email, password } = validated;

    const { accessToken, refreshToken } = await login(email, password);

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return res.status(400).json({ message: messages });
    }
    res.status(401).json({ message: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const validated = refreshTokenSchema.parse(req.body);
    const token = validated.refreshToken;

    const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(token);

    res.json({
      message: "Token refreshed successfully",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return res.status(400).json({ message: messages });
    }
    res.status(401).json({ message: error.message });
  }
};

export const logoutUser = async (req: AuthRequest, res: Response) => {
  try {
    const validated = refreshTokenSchema.parse(req.body);
    const token = validated.refreshToken;

    await logout(token);

    res.json({
      message: "Logout successful",
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((e: any) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return res.status(400).json({ message: messages });
    }
    res.status(400).json({ message: error.message });
  }
};

// write function for me route
export const me = (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user; // This will be set by the authenticate middleware
  res.json({
    message: "Current logged in user",
    user,
  });
};

export default {
  signup: signupUser,
  login: loginUser,
  refreshToken,
  logout: logoutUser,
  me: me,
};
