import { Router } from "express"; 
import { loginUser as login, signupUser as signup , me, refreshToken, logoutUser} from "../auth/auth.controller"; 
import { authenticate } from "../middleware/auth.middleware"; 

const router = Router(); 
router.post("/signup", signup); 
router.post("/login", login); 
router.post("/refresh", refreshToken); 

// 🔥 Protected route 
router.get("/me", authenticate, me); 
router.post("/logout", authenticate, logoutUser); 
export default router;