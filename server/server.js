import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import testLogicRoutes from "./routes/testLogicRoutes.js";
import { optionalAuth } from "./middleware/optionalAuthMiddleware.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import setupSocketHandlers from "./socket/index.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/test', testLogicRoutes);

// Error Handling
app.use(errorHandler);
app.use(optionalAuth);
app.use(protect);

connectDB();

const PORT = process.env.PORT;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: "http://localhost:5173", // your frontend
    methods: ["GET", "POST"],
  },
});

setupSocketHandlers(io);
httpServer.listen(PORT, () => console.log("server is running on", PORT));
