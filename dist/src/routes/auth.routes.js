"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../auth/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/signup", auth_controller_1.signupUser);
router.post("/login", auth_controller_1.loginUser);
// 🔥 Protected route 
router.get("/me", auth_middleware_1.authenticate, auth_controller_1.me);
exports.default = router;
