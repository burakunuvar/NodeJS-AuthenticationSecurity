//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose = require('mongoose');
const User = require("./models/user");

mongoose.connect('mongodb://localhost:27017/userDBforAuth', {useNewUrlParser: true});

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
  const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
  newUser.save(function(err){
    if(!err){
      res.render("secret");
    }else{
      console.log(err);
    }
  });

});

app.post("/login",function(req,res){
  const email = req.body.username;
  const password = req.body.password;
  User.findOne({email:email},function(err,foundUser){
    if(!err){
      if(foundUser){
        if(foundUser.password === password){
          res.render("secret");
        }else{
          console.log("wrong password");
        }
      }else{
        console.log("no such user found");
      }
    }else{
      console.log(err);
    }
  });
});

app.listen(3000, function() {
  console.log("server started on port 3000");
});
