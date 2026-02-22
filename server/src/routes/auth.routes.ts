import { Router } from "express"; 
import { loginUser as login, signupUser as signup , me} from "../auth/auth.controller"; 
import { authenticate } from "../middleware/auth.middleware"; 

const router = Router(); 
router.post("/signup", signup); 
router.post("/login", login); 

// 🔥 Protected route 
router.get("/me", authenticate, me); 
export default router;