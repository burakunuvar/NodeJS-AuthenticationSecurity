//jshint esversion:6
const mongoose = require('mongoose');
// var encrypt = require('mongoose-encryption');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// const secret = "SECRET=ThisIsTheSecret";
// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret , encryptedFields: ["password"] });

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
