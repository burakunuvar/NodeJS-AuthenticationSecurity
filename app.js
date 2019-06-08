//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// var md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require("./models/user");


mongoose.connect('mongodb://localhost:27017/userDBforAuth', {
  useNewUrlParser: true
});

app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if (!err) {
        res.render("secret");
      } else {
        console.log(err);
      }
    });
    // Store hash in your password DB.
  });

});

app.post("/login", function(req, res) {
  const email = req.body.username;
  const password = req.body.password;

  User.findOne({email: email}, function(err, foundUser) {
    if (!err) {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, resCompare) {
          if (resCompare) {
            res.render("secret");
          } else {
            console.log("wrong password - no match found by bcrypt");
          }
        });
      }else{
        console.log("no such user found");
      }
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, function() {
  console.log("server started on port 3000");
});
