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
  "fw02i8": {
    id: "fw02i8",
    name: "name",
    email: "user@example.com",
    password: "purple"
  },
  "user2RandomID": {
    id: "user2RandomID",
    name: "name1",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "fw02i8" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "fw02i8" }
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

const authenticateUser = (email, password) => {
  //check if user exists
  const user = findUserByEmail(email);

  //check that email and pass match
  if (user && user.password === password) {
    return user.id;
  } else {
    return false;
  }
};

const generateRandomString = function() {
  return Math.random().toString(36).substring(2,8);
};


const findURLByUser = (userId) => {
  const currentUser = userId;
  let userURLs = {};
  for (let urls in urlDatabase) {
    console.log("userID:", urlDatabase[urls]['userID'])
    console.log("currentuser:", currentUser)
    if (urlDatabase[urls]['userID'] === currentUser) {
      userURLs[urls] = urlDatabase[urls].longURL;
    } 
  }
  return userURLs;
};

// //LOGIN
// app.post('/login', (req, res) => {
//   //set a cookie named usersame to the value submitted in req.body
//   //redirect to urls
//   const userId = req.body.user_id; //how its identified in ejs
//   res.cookie('user_id', userId);
//   res.redirect('/urls');
// });

//VIEW LOGIN PAGE
app.get('/login', (req, res) => {
  const userId = req.cookies.user_id;
  const templateVars = {
    user: users[userId]//change to null?
  };
  res.render('urls_login', templateVars);
});

//LOGIN PAGE
app.post('/login', (req, res) => {
  //check the input
  const { email, password } = req.body;
  //check user email, password 
  const userId = authenticateUser(email, password);
  
  if (userId) {
    res.cookie('user_id', userId);
    res.redirect('/urls');
  } else {
    //if user doesn't exist
    res.status(403).send('Error: your email/password was not found.');
  }

  //res.render('urls_login', templateVars);

});

//VIEW REGISTER PAGE
app.get('/register', (req, res) => {
  const userId = req.cookies.user_id;
  const templateVars = {
    user: users[userId]//change to null?
  };
  res.render('urls_register', templateVars);
});

//REGISTER NEW USER
app.post('/register', (req,res) => {
  const {name, email, password } = req.body;
  const user = findUserByEmail(email);
  
  if (email.length === 0 && password.length === 0) {
    res.status(411).send('Error: please fill out the required fields to register to TinyApp.');
  } else if (!user) {
    //add user id
    const userId = addNewUser(name, email, password);
    //assign cookie
    res.cookie('user_id', userId);
    console.log(users);
    res.redirect('/urls');
  } else {
    res.status(401).send('Error: try a different email to register to TinyApp.');
  }

});

//LOGOUT
app.post('/logout', (req, res) => {
  // const userId = req.body.user_id; //how its identified in ejs
  // res.cookie('user_id', userId);
  res.clearCookie('user_id');
  // for (let urls in urlDatabase) {
  //   delete urlDatabase[urls];
  // }
  res.redirect('/urls');
});


//MY URLS
app.get('/urls', (req,res) => {
  const userId = req.cookies.user_id;
  if(!userId) {
    res.redirect('/login');
  } else {
  console.log("userdb:", urlDatabase);
    const templateVars = {
      user: users[userId],
      urls: findURLByUser(userId) //here we pass in filtered value
    };
    res.render('urls_index', templateVars);
  }
});


//NEW URLS - FORM
app.get('/urls/new', (req,res) => {
  //check if user is logged in, else redirect to login
  const userId = req.cookies.user_id;
  if (userId) {
    const templateVars = {
      user: users[userId],
    };
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
});

//SAVE NEW URLS + REDIRECT
app.post('/urls', (req, res) => {
  console.log(req.body); //log the post to the body

  // i3BoGr: { longURL: "https://www.google.ca", userID: "fw02i8" }

  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID : req.cookies.user_id };

  res.redirect(`/urls/${shortURL}`); //need to redirect to /urls/
});

//SHORT URLS
app.get('/urls/:shortURL', (req,res) => {
  const shortURL = req.params.shortURL;
  const userId = req.cookies.user_id;
  
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
  const longURL = req.body.longURL;
  const shortURL = req.params.shortURL;
  console.log("shortURL:", shortURL);
  urlDatabase[shortURL] = longURL;
  console.log("urlDatabase:", urlDatabase);
  res.redirect('/urls');
});

//redirects to LONG URL
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const entry = urlDatabase[shortURL];
  if (entry) {
    res.redirect(entry.longURL); //http needed!!! show error if http not included
  } else {
    res.status(404).send('Error: url not found.')
  }
  
});

//DELETE URL
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

//server signal
app.listen(PORT, () => {
  console.log(`${PORT} is the magic port`);
});


