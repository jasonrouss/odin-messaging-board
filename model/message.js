let mongoose = require("mongoose");

//Article Schema
let messageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  author: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

let Message = (module.exports = mongoose.model("Message", messageSchema));
