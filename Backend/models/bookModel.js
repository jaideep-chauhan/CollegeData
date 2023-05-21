const mongoose = require('mongoose');



const bookSchema = new mongoose.Schema({
  bookname: { type: String, required: true },
//  email: { type: String, required: true },
 textarea: { type: String, required: true },
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
  publicationdate : { type: String, required: false },
  pages : { type: String, required: false },
  doi: { type: String, required: true },
  url: { type: String, required: true },
  file: { type: String, required: true, default: false },
  userRef:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;

