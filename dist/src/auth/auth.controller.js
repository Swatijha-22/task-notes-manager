"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.loginUser = exports.signupUser = void 0;
const auth_service_1 = require("./auth.service");
const signupUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, auth_service_1.signup)(email, password);
        res.json({
            message: "User registered",
            user: { email: user.email },
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.signupUser = signupUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await (0, auth_service_1.login)(email, password);
        res.json({
            message: "Login successful",
            token,
        });
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.loginUser = loginUser;
// write function for me route
const me = (req, res) => {
    // @ts-ignore
    const user = req.user; // This will be set by the authenticate middleware
    res.json({
        message: "Current logged in user",
        user,
    });
};
exports.me = me;
exports.default = {
    signup: exports.signupUser,
    login: exports.loginUser,
    me: exports.me,
};
