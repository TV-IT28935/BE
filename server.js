import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dbConnect from "./src/config/dbConnect.js";
import cors from "cors";
import userRouter from "./src/routes/userRoute.js";
import authRouter from "./src/routes/authRoute.js";
import categoryRouter from "./src/routes/categoryRoute.js";

dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    credentials: true,
  })
);

app.use("/v1/api/", authRouter);
app.use("/v1/api/user", userRouter);
app.use("/v1/api/category", categoryRouter); // Gán route danh mục

const startServer = async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
