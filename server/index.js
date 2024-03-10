import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js"; //we can rename the imported anything, even if its name something else
import commentRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";

const app = express(); //Creates an instance of the Express application.
dotenv.config(); //Loads environment variables from a .env file into process.env

const connect = () => {
  mongoose
    .connect(process.env.MONGO) //Connects to the MongoDB database using the connection string specified in the MONGO environment variable.
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => {
      throw err;
    });
};

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status: status,
    message: message,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Conected to Server");
});
