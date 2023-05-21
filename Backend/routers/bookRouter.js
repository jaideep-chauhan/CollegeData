const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/ftaskModel");
const Book = require("../models/bookModel");
const shared = require("../utils/shared")
// const booktask = require('../models/bookModel');
const xlsx = require('xlsx');

const bookRouter = express.Router();
const { verifyToken } = require("../jwtVerify");
bookRouter.use(verifyToken);  

bookRouter.post(
  "/addtask",
  expressAsyncHandler(async (req, res) => {
    try {
      const {
        bookname,
        email,
        textarea,
        author,
        coauthor,
        publisher,
        publicationdate,
        pages,
        doi,
        url,
        file,
      } = req.body;

      const book = new Book({
        bookname,
        email,
        textarea,
        author,
        coauthor,
        publisher,
        publicationdate,
        pages,
        doi,
        url,
        file,
        userRef: req.id,
      });
      console.log(book);
      const taskadded = book.save();
      if (!taskadded) {
        res.status(401).send({
          message: "Invalid Task Data",
        });
      } else {
        res.send({
          bookname: taskadded.bookname,
          // email: taskadded.email,
          textarea: taskadded.textarea,
          author: taskadded.author,
          coauthor: taskadded.coauthor,
          publisher: taskadded.publisher,
          publicationdate: taskadded.publicationdate,
          pages: taskadded.pages,
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



bookRouter.get(
  "/addtask",
  expressAsyncHandler(async (req, res) => {
    try {
      if (req.role === "admin") {
        console.log("admin");
        taskadded = await Book.find();
        if (!taskadded) {
          console.log("taskadded is empty");
        }
        return res.status(200).send([taskadded]);
      } else if (req.role === "faculty") {
        console.log("Faculty ");
        let query = {
          userRef: req.id,
        };
        taskadded = await Book.find(query);
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



bookRouter.get('/download-book', expressAsyncHandler(async (req, res) => {
  try {
    const jsonData = await Book.find();
    const keys = []
    Object.keys(jsonData[0]).forEach(key => {
      keys.push(key);
    })
    // const keys = Object.keys(jsonData[0]);

    console.log("Here is Json Data", jsonData)
    // console.log("the keys is", keys);
    const columnData = [
      "bookname",
      "textarea",
      "author",
      "coauthor",
      "publisher",
      "publicationdate",
      "pages",
      "doi",
      "url",
      "file",

    ]
    const rowData = jsonData.map(json => {
      return [json.bookname, json.textarea, json.author, json.coauthor, json.publisher, json.publicationdate, json.pages,
      json.doi,
      json.url,
      json.file,];
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

    // Apply bold formatting to the cells in the column
    // columnAddresses.forEach(address => {
    //   const cell = workSheet[columnToBold + address];
    //   if (cell && cell.v) {
    //     console.log("reached here");
    //     // const style = workbook.SSF.get_table()[cell.z].split(';');
    //     style[1] = 'font-weight:bold'; // Make font bold
    //     style[2] = 'background-color:FFFF00'; // Set fill color to yellow
    //     cell.z = style.join(';');
    //   }
    // });
    // xlsx.writeFile(workbook,path)
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


module.exports = bookRouter;
