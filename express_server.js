const express = require('express');
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//set view engine to ejs
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Random string generator
const generateRandomString = function() {
  return Math.random().toString(36).substring(2,8);
};

//URLS
app.get('/urls', (req,res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

//NEW URLS - FORM
app.get('/urls/new', (req,res) => {
  res.render('urls_new');
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
  
    console.log("shortURL:", req.params.shortURL)
    console.log("longURL:", urlDatabase[shortURL])
    console.log("urlDatabase:", urlDatabase)
  
//if the shortURL exists, render
//if shortURL is not in urlDatabase, redirect to /urls
//undefined
  if (urlDatabase[shortURL]) { //will check in the database, if it exists, we render the page as normal
    const templateVars = {
      shortURL,
      longURL: urlDatabase[shortURL]
    };
    res.render('urls_show', templateVars);
  } else { //if it doesn't, it comes back as undefined === falsy, and we want to redirect to main page
    res.redirect('/urls');
  }
});

//redirects to LONG URL
app.get('/u/:shortURL', (req, res) => {
  console.log(req.body)
  const longURL = req.body.longURL;
  res.redirect(longURL);
});


//server signal
app.listen(PORT, () => {
  console.log(`${PORT} is the magic port`);
});