import express from "express";

const app = express();
import cors from "cors";
const PORT = process.env.PORT;
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import testLogicRoutes from "./routes/testLogicRoutes.js";
import dotenv from "dotenv";
import { optionalAuth } from "./middleware/optionalAuthMiddleware.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import { createServer } from "http";
import { Server } from "socket.io";
import setupSocketHandlers from "./socket/index.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(logger);

//routes
app.use("/api/users/", userRoutes);

//typing routes
app.use("/api/typing", testLogicRoutes);

//Error Handling
app.use(errorHandler);
app.use(optionalAuth);
app.use(logger);
app.use(protect);

connectDB();

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
