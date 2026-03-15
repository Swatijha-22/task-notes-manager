"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }
    try {
        const SECRET = process.env.JWT_SECRET || "mysecretkey"; // moved here!
        console.log("SECRET used to verify:", SECRET); // add this
        console.log("Token received:", token);
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        console.log("Decoded:", decoded); // add this line
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log("JWT Error:", error.name, error.message);
        return res.status(401).json({ message: error.message });
    }
}
