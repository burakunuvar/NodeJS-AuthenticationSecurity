
## Authentication and Security in NodeJS
### Intro & Getting Set Up :
```  
$ npm init -y
$ npm install express body-parser ejs
```
Create the app.js based on boilerplate with the routes for home , login, register

### L1 Security - Username and Password :

```  
$ npm install mongoose
```  
Update the app.js with require mongoose and mongoose.connect
```
$ const mongoose = require('mongoose');
$ mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});
$ userSchema and model

  " const userSchema = new mongoose.Schema({
        username: String,
        password: String
    });
    const User = mongoose.model("User", userSchema); "
```

Build the post route for register
```
  " const newUser = new User({
      username: req.body.username,
      password: req.body.password
    }); "
```
Build the post route for login
```
  " User.findOne({email:email},function(err,foundUser){})"
```
**Issue :** Anyone with access to DB will have access to passwords.


### L2 Security - Database Encryption :

* [Mongoose-Encryption](https://www.npmjs.com/package/mongoose-encryption)

```
$ npm i mongoose-encryption
```

For convenience, you can also pass in a single secret string instead of two keys
* [Mongoose-Encryption Secret-String](https://www.npmjs.com/package/mongoose-encryption#secret-string-instead-of-two-keys)


How to include or exclude related fields :

```
$ userSchema.plugin(encrypt, { secret: secret , encryptedFields: ["password"] });
```

**Issue :**  Anyone with access to DB and app.js will have access to passwords.

L2 Security Leveraged : Environment Variables
* [DotEnv Package](https://www.npmjs.com/package/dotenv)

```
    $ npm i dotenv
    $ require('dotenv').config()
    $ touch .env ( as hidden file)
```
`const secret = "ThisIsTheSecret"` should be moved to .env as `SECRET=ThisIsTheSecret`
```
$ touch .gitignore ( as hidden file)
```

* [Gitignore for Node](https://github.com/github/gitignore/blob/master/Node.gitignore)
  ( for instance , node_modules is ignored. All packages might be installed with "npm install" command )

**Issue :** Anyone with access to DB, app.js and .env will have access to passwords.


### L3 Security - Hashing Passwords

* [Hasing with md](https://www.npmjs.com/package/md5)
Hashing uses a hash function, which replaced key in encryption and provides a one way - irreversible approach.

```
$ npm i md5
```

**Issue :** might still be hacked
* https://plaintextoffenders.com/
* https://haveibeenpwned.com/
All words from dictionary, all numbers from telephone book = ~ 19.8 B
TAKES ALMOST 1 SECOND WITH A GPU TO CALCULATE, for MD5 Hashes
* https://en.wikipedia.org/wiki/List_of_the_most_common_passwords
