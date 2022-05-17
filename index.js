require("dotenv").config({
  path: "./config.env",
});
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const _ = require("lodash");
const workerRouter = require("./routes/worker");
const csv = require("csv-parse");
const machineRouter = require("./routes/machine");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const recordRouter = require("./routes/record");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const app = express();

// * Connect db
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ["http://localhost:3000/"],
  optionsSuccessStatus: 200,
};

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/worker", workerRouter);
app.use("/machine", machineRouter);
app.use("/api/auth", authRouter);
app.use("/users", userRouter);
app.use("/record", recordRouter);

// * Error handler should be last peice of middleware
app.use(errorHandler);

const server = app.listen(process.env.PORT || 9000, (req, res) => {
  console.log("Listening on port 9000");
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err}`);
  server.close(() => process.exit(1));
});
