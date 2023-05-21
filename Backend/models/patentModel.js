const mongoose = require('mongoose');


const patentSchema = new mongoose.Schema({
  patenttitle: { type: String, required: true },
  // patentemail: { type: String, required: true },
  description: { type: String, required: true },
  patentnumber: { type: String, required: true },
  numberofmember: { type: Number, required: true },
  membername: { type: String, required: true },
  patentdate: {
    type: String,
    required: true,
    
  },
  userRef:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  patentradio : { type: String, required: false },
  patenturl: { type: String, required: true },
  patentfile: { type: String, required: true, default: false },
  // userRef:{
  //   type:mongoose.Schema.Types.ObjectId,
  //   required:true
  // },
});

const Patent = mongoose.model('Patent', patentSchema);
module.exports = Patent;

