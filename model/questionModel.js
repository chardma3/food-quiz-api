const mongoose = require("mongoose");

// Define the schema for the document
const questionSchema = mongoose.Schema({
  question: String,
  option1: String,
  option2: String,
  option3: String,
  answer: Number,
  level: Number,
});

// Create the Mongoose model based on the schema
module.exports = mongoose.model("Question", questionSchema);
