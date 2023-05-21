const express = require('express');
const expressAsyncHandler = require('express-async-handler');
//  const User = require('../models/ftaskModel');
const Research = require('../models/researchModel');
const xlsx = require('xlsx');

const researchRouter = express.Router();
const { verifyToken } = require("../jwtVerify");
researchRouter.use(verifyToken);


researchRouter.get("/download-research", expressAsyncHandler(async (req, res) => {
  try {
    const jsonData = await Research.find();
    const keys = []
    Object.keys(jsonData[0]).forEach(key => {
      keys.push(key);
    })
    // const keys = Object.keys(jsonData[0]);

    console.log("Here is Json Data", jsonData)
    // console.log("the keys is", keys);
    const columnData = [  "rtitle", "remail", "rdescription", "rauthor", "rcoauthor", "rinstructorname", "rdate", "rpage", "rcoursenumber", "rurl", "rfile" ]
    const rowData = jsonData.map(json => {
      return [ 
        json.rtitle, json.remail, json.rdescription, json.rauthor, json.rcoauthor, json.rinstructorname, json.rdate, json.rpage, json.rcoursenumber, json.rurl, json.rfile
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
}))

researchRouter.post('/addtask', expressAsyncHandler(async (req, res) => {
  try {
    const { rtitle, remail, rdescription, rauthor, rcoauthor, rinstructorname, rdate, rpage, rcoursenumber, rurl, rfile } = req.body


    const research = new Research({
      rtitle: rtitle,
      remail: remail,
      rdescription: rdescription,
      rauthor: rauthor,
      rcoauthor: rcoauthor,
      rinstructorname: rinstructorname,
      rdate: rdate,
      rpage: rpage,
      rcoursenumber: rcoursenumber,
      rurl: rurl,
      rfile: rfile,
      userRef: req.id
    })
    console.log(research)

    const taskadded = await research.save();
    console.log(taskadded)
    if (!taskadded) {
      res.status(401).send({
        message: 'Invalid Task Data',
      });
    } else {
      console.log(taskadded)
      res.send({
        rtitle: taskadded.rtitle,
        remail: taskadded.remail,
        rdescription: taskadded.rdescription,
        rauthor: taskadded.rauthor,
        rcoauthor: taskadded.rcoauthor,
        rinstructorname: taskadded.rinstructorname,
        rdate: taskadded.rdate,
        rpage: taskadded.rpage,
        rcoursenumber: taskadded.rcoursenumber,
        rurl: taskadded.rurl,
        rfile: taskadded.rfile,
        userRef: req.id
      });
    }


  } catch (error) {
    console.log(error);
    return res.send(error);


  }
}))

researchRouter.get('/addtask', expressAsyncHandler(async (req, res) => {
  try {
    if (req.role === "admin") {
      console.log("admin");
      taskadded = await Research.find();
      if (!taskadded) {
        console.log("taskadded is empty");
      }
      return res.status(200).send([taskadded]);
    } else if (req.role === "faculty") {
      console.log("Faculty ");
      let query = {
        userRef: req.id,
      };
      taskadded = await Research.find(query);
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



module.exports = researchRouter;
