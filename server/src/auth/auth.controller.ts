import { Request, Response } from "express";
import { signup, login } from "./auth.service";

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await signup(email, password);

    res.json({
      message: "User registered",
      user: { email: user.email },
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const token = await login(email, password);

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
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
  me: me,
};
