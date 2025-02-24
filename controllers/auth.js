import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Hardcoded credentials
const USER_CREDENTIALS = {
    username: "naval.ravikant",
    password: "05111974"
};

// Login Route
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === USER_CREDENTIALS.username && password === USER_CREDENTIALS.password) {
        // Generate JWT Token
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ JWT: token });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

export default router;
