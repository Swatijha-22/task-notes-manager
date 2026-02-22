import { Router } from "express";
import { create, getAll, remove, update } from "../notes/note.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, getAll);
router.delete("/:id", authenticate, remove);
router.put("/:id", authenticate, update);

export default router;