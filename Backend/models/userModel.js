// import mongoose from 'mongoose';
const mongoose = require("mongoose");
const { Roles } = require("../utils/constants");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: { type: String, required: true },
  mobileNo: { type: Number, required: true },
  role: { type: String, required: true, default: Roles.FACULTY },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
