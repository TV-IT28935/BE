import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connection = async () => {
  const options = {
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
  };

  try {
    await mongoose.connect(process.env.DB_HOST, options);
    console.log("✅ Connection to DB successfully!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
};

export default connection;
