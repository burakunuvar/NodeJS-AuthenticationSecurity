Intro & Getting Set Up :

  $ npm init -y
  $ npm install express body-parser ejs
  * Create the app.js based on boilerplate with the routes for home , login, register


L1 Security : Username and Password

  $ npm install mongoose
  * update the app.js with require mongoose and mongoose.connect
  & const mongoose = require('mongoose');
  & mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});
  & userSchema and model

    " const userSchema = new mongoose.Schema({
          username: String,
          password: String
      });

      const User = mongoose.model("User", userSchema); "

  * build the post route for register

    " const newUser = new User({
        username: req.body.username,
        password: req.body.password
      }); "

  * build the post route for login
    "User.findOne({email:email},function(err,foundUser){})"

  Issue : Anyone with access to DB will have access to passwords.

L2 Security : Database Encryption

  * https://www.npmjs.com/package/mongoose-encryption
  $ npm i mongoose-encryption
  $ https://www.npmjs.com/package/mongoose-encryption#secret-string-instead-of-two-keys

  Issue : Anyone with access to DB and app.js will have access to passwords.

L2 Security : Environment Variables
  * https://www.npmjs.com/package/dotenv
  $ touch .env ( as hidden file)
    const secret = "ThisIsTheSecret" is moved to .env as SECRET=ThisIsTheSecret
  $ touch .gitignore ( as hidden file)
  * https://github.com/github/gitignore/blob/master/Node.gitignore
    ( for instance , node_modules is ignored. All packages might be installed with "npm install" command )

    Issue : Anyone with access to DB, app.js and .env will have access to passwords.

L3 Security : Hashing Passwords
  * build v3 for Secret Project
  * https://www.npmjs.com/package/md5
  * Hashing uses a hash function, which replaced key in encryption and provides a one way - irreversible approach.
  & npm i md5

    Issue : Hacking 101 :
      * https://plaintextoffenders.com/
      * https://haveibeenpwned.com/
      * all words from dictionary, all numbers from telephone book = ~ 19.8 B
          TAKES ALMOST 1 SECOND WITH A GPU TO CALCULATE, for MD5 Hashes
      * https://en.wikipedia.org/wiki/List_of_the_most_common_passwords


L4 Security : Salting and Hashing ( bcrypty instead of MD )
  * MD5 : 20B per sec by GPU
  * bcrypty : 17K per sec by GPU https://www.npmjs.com/package/bcrypt
  * requires latest version of node :  https://github.com/nvm-sh/nvm
  & root : nvm install 10.16.0 ( latest version @ nodejs.org)
  & secret project folder :npm i bcrypt

  * Update app.post for login and register routes.

    $  bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    $  // Store hash in your password DB.
    $  });

    $ bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
      // res == true
    $ });
