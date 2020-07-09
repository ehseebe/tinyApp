//const cookieParser = require('cookie-parser');
//app.use(cookieParser());
const { findUserByEmail, addNewUser, authenticateUser, generateRandomString, findURLByUser } = require('./helpers');
const express = require('express');
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const saltRounds = 10;
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs'); //set view engine to ejs
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));


//---DATABASES---//

const users = {
  "1": {
    id: "1",
    name: "name",
    email: "user@example.com",
    password: bcrypt.hashSync("purple", saltRounds)
  },
  "2": {
    id: "2",
    name: "name1",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", saltRounds)
  }
};


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "fw02i8" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "fw02i8" }
};


//---ROUTES---//

//LOGIN VIEW
app.get('/login', (req, res) => {
  const userId = req.session['user_id'];
  const templateVars = {
    user: users[userId]//change to null?
  };
  res.render('urls_login', templateVars);
});


//LOGIN AS USER
app.post('/login', (req, res) => {
  //check the input
  const { email, password } = req.body;
  const database = users;
  //check user email, password
  const userId = authenticateUser(email, password, database);
  
  if (userId) {
    req.session['user_id'] = userId;
    res.redirect('/urls');
  } else {
    //if user doesn't exist
    res.status(403).redirect('/urls_error_403');
  }
});


//ERROR 403 VIEW
app.get('/urls_error_403', (req, res) => {
  const userId = req.session['user_id'];
  const templateVars = {
    user: users[userId]//change to null?
  };
  res.render('urls_error_403', templateVars);
});


//REGISTER VIEW
app.get('/register', (req, res) => {
  const userId = req.session['user_id'];
  const templateVars = {
    user: users[userId]//change to null?
  };
  res.render('urls_register', templateVars);
});


//REGISTER NEW USER
app.post('/register', (req,res) => {
  const { email, password } = req.body;
  const database = users;
  const user = findUserByEmail(email, users);
  
  if (email.length === 0 && password.length === 0) {
    res.status(411).redirect('/urls_error_411');
  } else if (!user) {
    //add user id
    const userId = addNewUser(email, password, database);
    //setCookie with the user id
    req.session['user_id'] = userId;
    //res.cookie('user_id', userId); PREVIOUSLY
    console.log(users);
    res.redirect('/urls');
  } else {
    res.status(401).redirect('/urls_error_401');
  }
});


//ERROR 411 VIEW
app.get('/urls_error_411', (req, res) => {
  const userId = req.session['user_id'];
  const templateVars = {
    user: users[userId]//change to null?
  };
  res.render('urls_error_411', templateVars);
});


//ERROR 401 VIEW
app.get('/urls_error_401', (req, res) => {
  const userId = req.session['user_id'];
  const templateVars = {
    user: users[userId]//change to null?
  };
  res.render('urls_error_401', templateVars);
});


//LOGOUT
app.post('/logout', (req, res) => {
  //clear the cookies
  req.session['user_id'] = null;
  res.redirect('/urls');
});


//MY URLS VIEW
app.get('/urls', (req,res) => {
  const userId = req.session['user_id'];
  const database = urlDatabase;
  if (!userId) {
    res.redirect('/login');
  } else {
    console.log("urlDatabase:", urlDatabase);
    const templateVars = {
      user: users[userId],
      urls: findURLByUser(userId, database) //here we pass in filtered value
    };
    res.render('urls_index', templateVars);
  }
});


//CREATE NEW URL
app.get('/urls/new', (req,res) => {
  //check if user is logged in, else redirect to login
  const userId = req.session['user_id'];
  if (userId) {
    const templateVars = {
      user: users[userId],
    };
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
});


//ADD NEW URL TO DB + REDIRECT
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID : req.session['user_id']
  };
  res.redirect(`/urls/${shortURL}`); //need to redirect to /urls/
});


//SHORT URL + EDIT VIEW
app.get('/urls/:shortURL', (req,res) => {
  const shortURL = req.params.shortURL;
  const userId = req.session['user_id'];
  
  if (urlDatabase[shortURL]) { //will check in the database, if it exists, we render the page as normal
    const templateVars = {
      user: users[userId],
      shortURL,
      longURL: urlDatabase[shortURL].longURL
    };
    res.render('urls_show', templateVars);
  } else { //if it doesn't, it comes back as undefined === falsy, and we want to redirect to main page
    res.redirect('/urls');
  }
});


//EDIT URL
app.post('/urls/:shortURL', (req, res) => {
  const userId = req.session['user_id'];
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  
  if (!userId) {
    res.redirect('/login');
  } else if (longURL.length === 0) {
    res.status(411).redirect('/urls_error_411');
  } else {
    //console.log("shortURL:", shortURL);
    urlDatabase[shortURL].longURL = longURL;
    res.redirect('/urls');
  }

  console.log("urlDatabase:", urlDatabase);
});


//SHORT URL redirect to LONG URL
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const entry = urlDatabase[shortURL];
  if (entry) {
    res.redirect(entry.longURL); //http needed!!! show error if http not
  } else {
    res.status(404).send('Error: url not found.');
  }
});


//DELETE URL
app.post('/urls/:shortURL/delete', (req, res) => {
  const userId = req.session['user_id'];
  if (!userId) {
    res.redirect('/login');
  } else {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect('/urls');
});


//SERVER SIGNAL
app.listen(PORT, () => {
  console.log(`${PORT} is the magic port`);
});


