"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || "supersecretkey123";
async function signup(email, password) {
    const existing = await user_model_1.User.findOne({ email });
    if (existing) {
        throw new Error("User already exists");
    }
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const newUser = await user_model_1.User.create({
        email,
        password: hashed,
    });
    return newUser;
}
async function login(email, password) {
    const user = await user_model_1.User.findOne({ email }).select("+password");
    if (!user)
        throw new Error("User not found");
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid)
        throw new Error("Wrong password");
    const token = jsonwebtoken_1.default.sign({ id: user._id, email }, SECRET, {
        expiresIn: "1h",
    });
    return token;
}
