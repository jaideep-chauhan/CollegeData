const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/ftaskModel");
const Patent = require("../models/patentModel");
const xlsx = require('xlsx');

const patentRouter = express.Router();
const { verifyToken } = require("../jwtVerify");
patentRouter.use(verifyToken);

patentRouter.post(
  "/addtask",
  expressAsyncHandler(async (req, res) => {
    try {
      const {
        patenttitle,
        patentemail,
        description,
        patentnumber,
        numberofmember,
        membername,
        date,
        radio,
        url,
        file,
      } = req.body;

      const patent = new Patent({
        patenttitle: patenttitle,
        patentemail: patentemail,
        description: description,
        patentnumber: patentnumber,
        numberofmember: numberofmember,
        membername: membername,
        patentdate: date,
        patentradio: radio,
        patenturl: url,
        patentfile: file,
        userRef: req.id,
      });
      console.log(patent);
      const taskadded = await patent.save();
      if (!taskadded) {
        res.status(401).send({
          message: "Invalid Task Data",
        });
      } else {
        res.send({
          patenttitle: taskadded.patenttitle,
          patentemail: taskadded.patentemail,
          description: taskadded.description,
          patentnumber: taskadded.patentnumber,
          numberofmember: taskadded.numberofmember,
          membername: taskadded.membername,
          date: taskadded.patentdate,
          radio: taskadded.patentradio,
          url: taskadded.patenturl,
          file: taskadded.patentfile,
          userRef: req.id,
        });
      }
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  })
);

patentRouter.get(
  "/addtask",
  expressAsyncHandler(async (req, res) => {
    try {
      if (req.role === "admin") {
        console.log("admin");
        taskadded = await Patent.find();
        if (!taskadded) {
          console.log("taskadded is empty");
        }
        return res.status(200).send([taskadded]);
      } else if (req.role === "faculty") {
        console.log("Faculty ");
        let query = {
          userRef: req.id,
        };
        taskadded = await Patent.find(query);
        console.log(taskadded);
        if (!taskadded) {
          console.log("taskadded is empty");
        }
        return res.status(200).send([taskadded]);
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })
);

module.exports = patentRouter;
