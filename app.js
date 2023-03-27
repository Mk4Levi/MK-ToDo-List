//
// requiring modules for this app
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
const port = process.env.PORT || 3000;

// app.set()
app.set("view engine", "ejs");

// app.use()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// connecting 'mongoose' with 'mongodb' database
mongoose.connect(
  "mongodb+srv://Manthan6296:Mkp-6296@cluster0.yysjuox.mongodb.net/todolistDB",
  { useNewUrlParser: true }
);
// mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

// creating mongoose Schema
const itemsSchema = {
  name: String,
};

// creating mongoose Model
const Item = mongoose.model("Item", itemsSchema);

// adding items to this collection named 'items' of this db
const item1 = new Item({
  name: "Welcome to your TodoList Web-App!",
});

const item2 = new Item({
  name: "Click (+) button to add a new item.",
});

const item3 = new Item({
  name: "Double-Click the checkbox to delete an item.",
});

const defaultItems = [item1, item2, item3];

// app.get()
app.get("/", function (req, res) {
  let day = date.getDate();

  Item.find()
    .then(function (foundItems) {
      console.log(foundItems);

      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then(function () {
            console.log("Successfully saved default items to DB.");
          })
          .catch(function (err) {
            console.log("Error found in saving default items to DB: " + err);
          });
          res.redirect("/");
      } else {
        res.render("list", {
          listTitle: day,
          newListItems: foundItems,
        });
      };
    })
    .catch(function (err) {
      console.log(err);
    });
});

// app.post()
app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");
});

// app.post() for delete routes
app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId)
  .then(function(err) {
    if (!err) {
      console.log("Successfully removed the checked item.");
      res.redirect("/");
    };
  });
});

// other routes
app.get("/work", function (req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems,
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

// app.listen()
app.listen(port, function () {
  console.log("Server started on port " + port);
});
