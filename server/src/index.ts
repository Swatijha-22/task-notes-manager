import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes";
import noteRoutes from "./routes/note.routes";
import aiRoutes from "./routes/ai.routes";

import { connectDB } from "./config/db";
connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

// ============================================
// 🔒 SECURITY MIDDLEWARE (MUST BE FIRST)
// ============================================

// Helmet adds security headers (X-Content-Type-Options, Strict-Transport-Security, X-Frame-Options, etc.)
app.use(helmet());

// Global rate limiter: 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Auth-specific rate limiter: 10 requests per 15 minutes per IP (stricter for authentication)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many login/signup attempts, please try again later.",
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply global rate limiter to all routes
app.use(globalLimiter);

// Restricted CORS - only allow requests from the client URL
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Parse JSON and form data
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
  res.send("API Running");
});

// ============================================
// 🔐 REGISTER ROUTES WITH AUTH LIMITER
// ============================================

// Apply stricter rate limiter to auth routes
app.use("/auth", authLimiter, authRoutes);

// Apply global rate limiter to other routes
app.use("/notes", noteRoutes);
app.use("/ai", aiRoutes);

// ============================================
// ✅ ERROR HANDLING MIDDLEWARE
// ============================================

// Catch-all error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
);

// ============================================
// 🚀 START SERVER
// ============================================

app.listen(5000, () => {
  console.log("🔒 Server running on port 5000 with security middleware enabled");
});
