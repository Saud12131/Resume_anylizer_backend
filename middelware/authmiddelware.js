import jwt from "jsonwebtoken";

// Middleware to verify JWT
export function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.sendStatus(401); // Unauthorized
        }

        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ 
                    error: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token" 
                });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        return res.status(500).json({ error: "Authentication error" });
    }
}
