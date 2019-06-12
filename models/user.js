//jshint esversion:6
const mongoose = require('mongoose');
// var encrypt = require('mongoose-encryption');
const passportLocalMongoose = require('passport-local-mongoose');

const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
});

// const secret = "SECRET=ThisIsTheSecret";
// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret , encryptedFields: ["password"] });

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

module.exports = User;
