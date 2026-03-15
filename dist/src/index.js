"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const note_routes_1 = __importDefault(require("./routes/note.routes"));
const db_1 = require("./config/db");
(0, db_1.connectDB)();
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("API Running");
});
// ✅ REGISTER ROUTES FIRST
app.use("/auth", auth_routes_1.default);
app.use("/notes", note_routes_1.default);
// ✅ THEN START SERVER
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
// mongodb+srv://swatijha2022_db_user:HT9pLfrmZrUhjCzm@cluster0.hsjjqoo.mongodb.net/?appName=Cluster0
