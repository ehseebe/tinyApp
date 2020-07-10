const { findUserByEmail, addNewUser, authenticateUser, generateRandomString, findURLByUser } = require('./helpers');
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const saltRounds = 10;
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
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

app.get('/', (req, res) => {
  const templateVars = {
    user: null
  };
  res.render('urls_login', templateVars);
});


//MY URLS VIEW
app.get('/urls', (req,res) => {
  const userId = req.session['user_id'];
  const database = urlDatabase;

  if (!userId) {
    res.redirect('/urls_error_401');
  } else {
    const templateVars = {
      user: users[userId],
      urls: findURLByUser(userId, database)
    };
    res.render('urls_index', templateVars);
  }
});


//CREATE NEW URL
app.get('/urls/new', (req,res) => {
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


//SHORT URL + EDIT VIEW
app.get('/urls/:shortURL', (req,res) => {
  const shortURL = req.params.shortURL;
  const userId = req.session['user_id'];
  
  if (!userId) {
    res.redirect('/urls');
  } else {
    const templateVars = {
      user: users[userId],
      shortURL,
      longURL: urlDatabase[shortURL].longURL
    };
    res.render('urls_show', templateVars);
  }
});


//SHORT URL redirect to LONG URL
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const entry = urlDatabase[shortURL];

  if (entry) {
    res.redirect(entry.longURL);
  } else {
    res.status(404).redirect('/urls_error_404');
  }
});


//ADD NEW URL TO DB + REDIRECT
app.post('/urls', (req, res) => {
  const userId = req.session['user_id'];
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  
  if (!userId) {
    res.redirect('/login');
  } else if (longURL.length <= 7) {
    res.status(411).redirect('/urls_error_411');
  } else {
  
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID : req.session['user_id']
    };
    res.redirect(`/urls/${shortURL}`);
  }
});


//EDIT URL
app.post('/urls/:shortURL', (req, res) => {
  const userId = req.session['user_id'];
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  
  if (!userId) {
    res.redirect('/login');
  } else if (longURL.length <= 7) {
    res.status(411).redirect('/urls_error_411');
  } else {
    urlDatabase[shortURL].longURL = longURL;
    res.redirect('/urls');
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


//LOGIN VIEW
app.get('/login', (req, res) => {
  const templateVars = {
    user: null
  };
  res.render('urls_login', templateVars);
});


//REGISTER VIEW
app.get('/register', (req, res) => {
  const templateVars = {
    user: null
  };
  res.render('urls_register', templateVars);
});


//LOGIN AS USER
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const database = users;
  const userId = authenticateUser(email, password, database);
  
  if (userId) {
    req.session['user_id'] = userId;
    res.redirect('/urls');
  } else {
    res.status(403).redirect('/urls_error_403');
  }
});


//REGISTER NEW USER
app.post('/register', (req,res) => {
  const { email, password } = req.body;
  const database = users;
  const user = findUserByEmail(email, users);

  if (email.length === 0 && password.length === 0) {
    res.status(411).redirect('/urls_error_411');
  } else if (!user) {
    const userId = addNewUser(email, password, database);
    req.session['user_id'] = userId;
    res.redirect('/urls');
  } else {
    res.status(401).redirect('/urls_error_401');
  }
});


//LOGOUT
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});


//ERROR 401 VIEW
app.get('/urls_error_401', (req, res) => {
  const templateVars = {
    user: null
  };
  res.render('urls_error_401', templateVars);
});


//ERROR 403 VIEW
app.get('/urls_error_403', (req, res) => {
  const templateVars = {
    user: null
  };
  res.render('urls_error_403', templateVars);
});

//ERROR 404 VIEW
app.get('/urls_error_404', (req, res) => {
  const templateVars = {
    user: null
  };
  res.render('urls_error_404', templateVars);
});


//ERROR 411 VIEW
app.get('/urls_error_411', (req, res) => {
  const templateVars = {
    user: null
  };
  res.render('urls_error_411', templateVars);
});


//SERVER SIGNAL
app.listen(PORT, () => {
  console.log(`${PORT} is the magic port`);
});


