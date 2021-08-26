import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import tweetRoutes from "./routes/tweetRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://aatwitterclone.netlify.app",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("aatwitterclone working!");
});

app.use("/api/tweets", tweetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tokens", tokenRoutes);

const port = process.env.PORT || 8000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(port, (req, res) =>
      console.log(`DB is connected and server running on port: ${port}`)
    );
  })
  .catch((err) => {
    console.log(err);
  });
