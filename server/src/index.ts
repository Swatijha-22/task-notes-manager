import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import noteRoutes from "./routes/note.routes";
import aiRoutes from "./routes/ai.routes";



import { connectDB } from "./config/db";
connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

// ✅ REGISTER ROUTES FIRST
app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/ai", aiRoutes);

// ✅ THEN START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});



// mongodb+srv://swatijha2022_db_user:HT9pLfrmZrUhjCzm@cluster0.hsjjqoo.mongodb.net/?appName=Cluster0