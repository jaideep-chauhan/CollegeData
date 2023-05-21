const mongoose = require('mongoose');


const researchSchema = new mongoose.Schema({
  rtitle: { type: String, required: true },
  // email: { type: String, required: true,unique:false },
  rdescription: { type: String, required: true },
  rauthor: { type: String, required: true },
  rcoauthor: { type: String, required: true },
  rdate: {
    type: String,
    required: true,
    
  },
  userRef:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  rinstructorname: { type: String, required: false },
    rpage: { type: Number, required: true },
  rcoursenumber: { type: Number, required: true },
  rurl: { type: String, required: true },
  rfile: { type: String, required: true, default: false },
 
});

const Rtask = mongoose.model('Rtask', researchSchema);
module.exports = Rtask;
