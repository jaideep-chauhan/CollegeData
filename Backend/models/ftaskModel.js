const mongoose = require('mongoose');


const ftaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // email: { type: String, required: true },
  name1: { type: String, required: true },
  name2: { type: String, required: true },
  publishername: { type: String, required: true },
  date: {
    type: String,
    required: true,
    
  },
  userRef:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  DOI : { type: String, required: false },
  numberofpages: { type: Number, required: true },
  url: { type: String, required: true },
  file: { type: String, required: true, default: false },
});

const Ftask = mongoose.model('Ftask', ftaskSchema);
module.exports = Ftask;