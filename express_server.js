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

//ACTUAL FORM
app.post('/urls', (req, res) => {
  console.log(req.body); //log the post to the body
  //input longURL
  //generate shortURL
  //output and save shortURL and longURL
  const shortURL = generateRandomString(req.params.shortURL);
  const longURL = urlDatabase[shortURL];
  //create a new function here?
  const createNewURL = (longURL) => {
    const createNewURL = {
      shortURL,
      longURL
    };
  };
  createNewURL();

  res.redirect(`/urls/:${shortURL}`); //need to redirect to /urls/
});

//SHORT URLS
app.get('/urls/:shortURL', (req,res) => {
  const shortURL = generateRandomString(req.params.shortURL);
  const templateVars = {
    shortURL,
    longURL: urlDatabase[shortURL]};
  res.render('urls_show', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  res.redirect(longURL);
});


//server signal
app.listen(PORT, () => {
  console.log(`${PORT} is the magic port`);
});