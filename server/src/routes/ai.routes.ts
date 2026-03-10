import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { summarize, chat } from "../ai/ai.controller";

const router = Router();

router.post("/summarize", authenticate, summarize);
router.post("/chat", authenticate, chat);

export default router;
