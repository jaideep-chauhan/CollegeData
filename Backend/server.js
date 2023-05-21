const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const userRouter = require("./routers/userRouter");
const ftaskRouter = require("./routers/ftaskRouter");
const patentRouter = require("./routers/patentRouter");
const researchRouter = require("./routers/researchRouter");
const bookRouter = require("./routers/bookRouter");
const journalRouter = require("./routers/journalRouter");
const cookieParser = require("cookie-parser");
// const userRouter =require('./routers/userRouter');

const app = express();
const db = require("./mongoose");
const config = require("./config");

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

const port = 4001;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// RouTES/
app.use("/users", userRouter);
app.use("/admin", userRouter);
app.use("/task", ftaskRouter);
app.use("/patenttask", patentRouter);
app.use("/journaltask", journalRouter);
app.use("/booktask", bookRouter);
app.use("/researchtask", researchRouter);
app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
