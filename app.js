const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose.connect("mongodb://localhost/messagepug");
let db = mongoose.connection;

//Check connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//Check for db errors
db.on("error", (err) => {
  console.log(err);
});
//Init App

const app = express();
//Bring in modules
let messagedb = require("./model/message");

const PORT = process.env.PORT || 5000;

//Load View Engine Options
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// parse application/x-www-form-urlencoded
//Set Public Folder
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// Start Server
//Home Route
app.get("/", (req, res) => {
  messagedb.find({}, (err, messages) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Messages",
        messages: messages,
      });
    }
  });
});
//Get single message
app.get("/message/:id", (req, res) => {
  messagedb.findById(req.params.id, (err, message) => {
    if (err) {
      console.log(err);
    } else {
      res.render("message", {
        message: message,
      });
    }
  });
});

//Add Route
app.get("/messages/new", (req, res) => {
  res.render("add_message", {
    title: "Add Message",
  });
});
//Add Submit POST Route
app.post("/messages/new", (req, res) => {
  let message = new messagedb();
  message.title = req.body.title;
  message.author = req.body.author;

  message.body = req.body.body;
  message.save((err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect("/");
    }
  });
});

//Load edit form
app.get("/messages/edit/:id", (req, res) => {
  messagedb.findById(req.params.id, (err, message) => {
    if (err) {
      console.log(err);
    } else {
      res.render("edit_message", {
        title: "Edit message",
        message: message,
      });
    }
  });
});

//Update Submit POST Route
app.post("/messages/edit/:id", (req, res) => {
  let message = {};
  message.title = req.body.title;
  message.author = req.body.author;

  message.body = req.body.body;
  let query = { _id: req.params.id };
  messagedb.updateOne(query, message, (err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect("/");
    }
  });
});

app.delete("/message/:id", (req, res) => {
  let query = { _id: req.params.id };
  messagedb.deleteOne(query, (err) => {
    console.log(err);
  });
  res.send("Success");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
module.exports = app;
