const mongoose = require('mongoose');




const journalSchema = new mongoose.Schema({
  journaltitle: { type: String, required: true },
//  email: { type: String, required: true },
 description: { type: String, required: true },
  author: { type: String, required: true },
  coauthor: { type: String, required: true },
  publisher: {
    type: String,
    required: false,
    
  },
  userRef:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  }, 
 
  date : { type: String, required: false },
  doi: { type: String, required: true },
  url: { type: String, required: true },
  file: { type: String, required: true, default: false },
  
});

const Journal = mongoose.model('Journal', journalSchema);
module.exports = Journal;;

