import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { RefreshToken } from "../models/refreshToken.model";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const SECRET = process.env.JWT_SECRET || "mysecretkey";

export async function signup(email: string, password: string) {
  const existing = await User.findOne({ email });

  if (existing) {
    throw new Error("User already exists");
  }

  const hashed = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashed,
  });

  return newUser;
}

export async function generateRefreshToken(userId: string) {
  const token = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await RefreshToken.create({
    token,
    userId,
    expiresAt,
  });

  return token;
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) throw new Error("Wrong password");

  const accessToken = jwt.sign({ id: user._id, email }, SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = await generateRefreshToken(user._id.toString());

  return { accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken: string) {
  const tokenDoc = await RefreshToken.findOne({ token: refreshToken });

  if (!tokenDoc) {
    throw new Error("Refresh token not found");
  }

  if (new Date() > tokenDoc.expiresAt) {
    await RefreshToken.deleteOne({ token: refreshToken });
    throw new Error("Refresh token expired");
  }

  const user = await User.findById(tokenDoc.userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Delete old refresh token (token rotation)
  await RefreshToken.deleteOne({ token: refreshToken });

  // Generate new tokens
  const newAccessToken = jwt.sign({ id: user._id, email: user.email }, SECRET, {
    expiresIn: "1h",
  });

  const newRefreshToken = await generateRefreshToken(user._id.toString());

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(refreshToken: string) {
  await RefreshToken.deleteOne({ token: refreshToken });
}