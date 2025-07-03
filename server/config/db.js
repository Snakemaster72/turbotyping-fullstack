import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // Exit on failure
  }
};

export default connectDB;
