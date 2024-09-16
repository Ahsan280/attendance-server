import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import connectDB from "./db/index.js";
import userRouter from "./routes/user.routes.js";
import attendanceRouter from "./routes/attendance.routes.js";
import cookieParser from "cookie-parser";
import timeRouter from "./routes/time.routes.js";
import applicationRouter from "./routes/application.routes.js";
dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT;
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
connectDB()
  .then((response) => {
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed", error);
  });

app.use("/api/v1/users", userRouter);
app.use("/api/v1/attendance", attendanceRouter);
app.use("/api/v1/time", timeRouter);
app.use("/api/v1/application", applicationRouter);

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Keep-alive ping code
const url = process.env.PRODUCTION_URL;
const interval = 60000; // Ping every 60 seconds

function keepAlive() {
  axios
    .get(url)
    .then((response) => {
      console.log(
        `Pinged at ${new Date().toISOString()}: Status Code ${response.status}`
      );
    })
    .catch((error) => {
      console.error(
        `Error pinging at ${new Date().toISOString()}:`,
        error.message
      );
    });
}

setInterval(keepAlive, interval);
