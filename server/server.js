import express from "express";

const app = express();
import cors from "cors";
const PORT = process.env.PORT;
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//app.use(logger);

//routes
app.use("/api/users/", userRoutes);

//Error Handling
//

connectDB();

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
