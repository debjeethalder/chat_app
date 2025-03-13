import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
import { connectDb } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './lib/socket.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Fix __dirname for ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set default port
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // No need to repeat
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve Frontend in Production Mode
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../frontend/dist");
    console.log("Serving frontend from:", frontendPath);
    
    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

// Start Server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDb();
});
