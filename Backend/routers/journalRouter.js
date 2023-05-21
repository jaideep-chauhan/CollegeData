const express = require("express");
const expressAsyncHandler = require("express-async-handler");
// const User = require('../models/ftaskModel');
const Journal = require("../models/journalModel");
const xlsx = require('xlsx');

const journalRouter = express.Router();
const { verifyToken } = require("../jwtVerify");
journalRouter.use(verifyToken);


journalRouter.get('/download-book', expressAsyncHandler(async (req, res) => {
  try {
    const jsonData = await Journal.find();
    const keys = []
    Object.keys(jsonData[0]).forEach(key => {
      keys.push(key);
    })
    // const keys = Object.keys(jsonData[0]);

    console.log("Here is Json Data", jsonData)
    // console.log("the keys is", keys);
    const columnData = [
      
        "journaltitle",
        "description",
        "author",
        "coauthor",
        "date",
        "publisher",
        "doi",
        "url",
        "file",
     

    ]
    const rowData = jsonData.map(json => {
      return [ 
        json.journaltitle,
        json.description,
        json.author,
        json.coauthor,
        json.date,
        json.publisher,
        json.doi,
        json.url,
        json.file,
      ];
    })
    // const worksheet = xlsx.utils.json_to_sheet(jsonData);
    const workbook = xlsx.utils.book_new();
    const workSheetData = [
      columnData,
      ...rowData
    ];
    // const bold = workbook.add_format({ 'bold': true })
    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workbook, workSheet, 'Sheet1');
    const columnToBold = 'A';

    // Get all the cell addresses in the specified column
    const columnAddresses = Object.keys(workSheet)
      .filter(cell => cell.startsWith(columnToBold))
      .map(cell => cell.replace(columnToBold, ''));

    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    console.log("Here is data covernt intio Execl format", buffer)
    // Set response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
    res.send(buffer);
  } catch (err) {
    console.log('Error occurred', err);
    return res.status(404).send('Research Paper not found');
  }
}));

journalRouter.post(
  "/addtask",
  expressAsyncHandler(async (req, res) => {
    try {
      const {
        journaltitle,
        description,
        author,
        coauthor,
        date,
        publisher,
        doi,
        url,
        file,
      } = req.body;

      const journal = new Journal({
        journaltitle: journaltitle,
        description: description,
        author: author,
        coauthor: coauthor,
        date: date,
        publisher: publisher,
        doi: doi,
        url: url,
        file: file,
        userRef: req.id,
      });

      console.log(journal);
      const taskadded = await journal.save();
      if (!taskadded) {
        res.status(401).send({
          message: "Invalid Task Data",
        });
      } else {
        res.send({
          journaltitle: taskadded.journaltitle,
          description: taskadded.description,
          author: taskadded.author,
          coauthor: taskadded.coauthor,
          date: taskadded.date,
          publisher: taskadded.publisher,
          doi: taskadded.doi,
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

journalRouter.get(
  "/addtask",
  expressAsyncHandler(async (req, res) => {
    try {
      if (req.role === "admin") {
        console.log("admin");
        taskadded = await Journal.find();
        if (!taskadded) {
          console.log("taskadded is empty");
        }
        return res.status(200).send([taskadded]);
      } else if (req.role === "faculty") {
        console.log("Faculty ");
        let query = {
          userRef: req.id,
        };
        taskadded = await Journal.find(query);
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

module.exports = journalRouter;
