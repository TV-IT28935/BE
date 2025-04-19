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
import productRouter from "./src/routes/productRoute.js";
import saleRouter from "./src/routes/saleRoute.js";
import voucherRouter from "./src/routes/voucherRoute.js";
import brandRouter from "./src/routes/brandRoute.js";
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

app.use("/v1/api/auth", authRouter);
app.use("/v1/api/user", userRouter);
app.use("/v1/api/category", categoryRouter);
app.use("/v1/api/product", productRouter);
app.use("/v1/api/sale", saleRouter);
app.use("/v1/api/voucher", voucherRouter);
app.use("/v1/api/brand", brandRouter);

// app.use("/v1/api/position", positionRouter);

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
