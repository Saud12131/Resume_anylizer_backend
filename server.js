import 'dotenv/config';
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authroutes from "./controllers/auth.js";
import resumeRoutes from "./routes/ResumeRoutes.js";

connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/api/auth', authroutes);
app.use("/api/resume", resumeRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("server is running");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
