import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecretkey123";

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

export async function login(email: string, password: string) {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) throw new Error("Wrong password");

  const token = jwt.sign({ id: user._id, email }, SECRET, {
    expiresIn: "1h",
  });

  return token;
}