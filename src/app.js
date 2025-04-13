const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const http = require("http");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const jobRouter = require("./routes/jobRouter");



app.use("/", authRouter);
app.use("/user", userRouter);
app.use("/jobs", jobRouter);

const server = http.createServer(app);

dbConnect().then(() => {
  console.log("DB connection established");
  server.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });
});
