const mongoose = require('mongoose');


mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://jaideep:jaideep@datacollection.sgbm7ir.mongodb.net/?retryWrites=true&w=majority`);
// mongoose.connect('mongodb+srv://jaideep:jaideep@datacollection.sgbm7ir.mongodb.net/test');
const db = mongoose.connection;


db.on('error', console.error.bind(console, "Error connecting to MongoDB"));
// console.log("first")
db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});

module.exports = db;