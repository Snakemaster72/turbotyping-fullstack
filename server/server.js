import express from "express";

const app = express();
import cors from "cors";
const PORT = process.env.PORT;
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import testLogicRoutes from "./routes/testLogicRoutes.js";
import dotenv from "dotenv";
import { optionalAuth } from "./middleware/optionalAuthMiddleware.js";

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
app.use(optionalAuth);

connectDB();

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
