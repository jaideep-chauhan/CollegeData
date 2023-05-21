const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const Ftask = require("../models/ftaskModel");

const ftaskRouter = express.Router();
const { verifyToken } = require("../jwtVerify");
ftaskRouter.use(verifyToken);

ftaskRouter.post(
  "/addtask",
  expressAsyncHandler(async (req, res) => {
    try {
      const {
        title,
        name1,
        name2,
        publishername,
        date,
        numberofpages,
        DOI,
        url,
        file,
      } = req.body;

      const ftask = new Ftask({
        title: title,
        name1: name1,
        name2: name2,
        publishername: publishername,
        date: date,
        numberofpages: numberofpages,
        DOI: DOI,
        url: url,
        file: file,
        userRef: req.id,
      });
      console.log(ftask);
      const taskadded = await ftask.save();
      if (!taskadded) {
        res.status(401).send({
          message: "Invalid Task Data",
        });
      } else {
        res.send({
          title: taskadded.title,
          email: taskadded.email,
          name1: taskadded.name1,
          name2: taskadded.name2,
          publishername: taskadded.publishername,
          date: taskadded.date,
          numberofpages: taskadded.numberofpages,
          DOI: taskadded.DOI,
          url: taskadded.url,
          file: taskadded.file,
          userRef: req.id,
        });
      }
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  })
);

ftaskRouter.get(
  "/addtask",
  expressAsyncHandler(async (req, res) => {
    try {
      let query = {
        userRef: req.id,
      };

      let taskadded = null;
      if (req.isAdmin) {
        taskadded = await Ftask.find();
      } else taskadded = await Ftask.find(query);
      if (!taskadded) {
        console.log("taskadded is empty");
      }

      res.send([taskadded]);
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  })
);

module.exports = ftaskRouter;
