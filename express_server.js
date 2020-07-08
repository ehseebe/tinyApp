const express = require('express');
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//set view engine to ejs
app.set('view engine', 'ejs');

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const findUserByEmail = (email) => {
  //we have an email, need to check if exists
  for (let userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return false;
};

const addNewUser = (name, email, password) => {
  //generate userId
  const userId = generateRandomString();
  //new user object
  const newUser = {
    id: userId,
    name,
    email,
    password
  };

  users[userId] = newUser;

  return userId;
};

const generateRandomString = function() {
  return Math.random().toString(36).substring(2,8);
};

//LOGIN
app.post('/login', (req, res) => {
  //set a cookie named usersame to the value submitted in req.body
  //redirect to urls
  const username = req.body.userName; //how its identified in ejs
  res.cookie('username', username);
  console.log("username:", username)
  res.redirect('/urls');
});

//VIEW REGISTER PAGE
app.get('/register', (req, res) => {
  const templateVars = { 
    username: req.cookies["username"],//change to null?
  };
  res.render('urls_register', templateVars);
});

//REGISTER NEW USER
app.post('/register', (req,res) => {
  const {name, email, password } = req.body;

  //check if user exists in db
  //if user is found, we assign cookies
  //if not we redirect

  const user = findUserByEmail(email); //CREATE THIS FUNC

  if (!user) {
    //add user id
    const userId = addNewUser(name, email, password); //CREATE FUNC
    //assign cookie
    res.cookie('user_id', userId);
    res.redirect('/urls');
  } else {
    res.status(401).send('Error: try a different email');
  }

});

//LOGOUT
app.post('/logout', (req, res) => {
  const username = req.body.userName; //how its identified in ejs
  res.cookie('username', username);
  res.clearCookie('username');
  for (let urls in urlDatabase) {
    delete urlDatabase[urls];
  };
  //delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
})


//URLS
app.get('/urls', (req,res) => {
  const templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase 
  };
  res.render('urls_index', templateVars);
});


//NEW URLS - FORM
app.get('/urls/new', (req,res) => {
  const templateVars = { 
    username: req.cookies["username"],
  };
  res.render('urls_new', templateVars);
});

//SAVE NEW URLS + REDIRECT
app.post('/urls', (req, res) => {
  console.log(req.body); //log the post to the body

  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;

  res.redirect(`/urls/${shortURL}`); //need to redirect to /urls/
});

//SHORT URLS
app.get('/urls/:shortURL', (req,res) => {
  const shortURL = req.params.shortURL;
  
  console.log("shortURL:", req.params.shortURL);
  console.log("longURL:", urlDatabase[shortURL]);
  console.log("urlDatabase:", urlDatabase);
  
  //if the shortURL exists, render
  //if shortURL is not in urlDatabase, redirect to /urls
  //undefined
  if (urlDatabase[shortURL]) { //will check in the database, if it exists, we render the page as normal
    const templateVars = {
      username: req.cookies['username'],
      shortURL,
      longURL: urlDatabase[shortURL]
    };
    res.render('urls_show', templateVars);
  } else { //if it doesn't, it comes back as undefined === falsy, and we want to redirect to main page
    res.redirect('/urls');
  }
});

//EDIT
app.post('/urls/:shortURL', (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  console.log("shortURL:", shortURL);
  urlDatabase[shortURL] = longURL;
  console.log("urlDatabase:", urlDatabase);
  res.redirect('/urls');
});

//redirects to LONG URL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});




//server signal
app.listen(PORT, () => {
  console.log(`${PORT} is the magic port`);
});