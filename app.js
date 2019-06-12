//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// var md5 = require('md5');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const User = require("./models/user");

app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

// this part is for express-session
app.use(session({
  secret: 'secret needed by express-session module',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
}));

// this part is for passport
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDBforAuth', {
  useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);

// this part is for passportLocalMongoose
passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    // userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ['profile'] }));

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secret");
  });

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/secret", function(req, res) {
  if(req.isAuthenticated()){
    User.find({"secret":{$ne:null}},function(err,usersWithSecret){
      if(err){
        console.log(err);
      }else{
        res.render("secret",{usersWithSecret:usersWithSecret});
      }
    });
  }else{
    res.redirect("login");
  }
});

app.get("/submit", function(req, res) {
  if(req.isAuthenticated()){
    res.render("submit");
  }else{
    res.redirect("login");
  }
});

app.post("/submit",function(req,res){
    const submittedSecret = req.body.secret;
    User.findById(req.user.id,function(err,foundUser){
      if(err){
        console.log(err);
      }else{
        foundUser.secret = submittedSecret;
        foundUser.save(function(){
          res.redirect("/secret");
        });
      }
    });
});


app.post("/register", function(req, res) {
  const newUser= new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    }else{
      passport.authenticate('local')(req, res, function() {
        res.redirect('/secret');
      });
    }
  });
});

//alt 1
// app.post("/login", function(req, res) {
//   const user = new User({
//     username: req.body.username,
//     password: req.body.passport
//   });
//   req.login(user, function(err) {
//     if (err) {
//       console.log(err);
//     }else{
//       passport.authenticate('local')(req, res, function() {
//         res.redirect('/secret');
//       });
//     }
//   });
// });

//alt2
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}) ,function(req, res){
});


app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.listen(3000, function() {
  console.log("server started on port 3000");
});