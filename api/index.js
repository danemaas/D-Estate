import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("CONNECTED TO MongoDB!");
  })
  .catch((err) => {
    console.log("Error connecting to DB: ", err);
  });

const __dirname = path.resolve();

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use(cookieParser());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/dist/index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error.";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
