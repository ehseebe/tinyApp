const express = require('express');
const app = express();
const PORT = 8080; //default port 8080

//set view engine to ejs
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/urls', (req,res) => {
  let templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});



//index page
app.get('/', (req, res) => {
  const drinks = [
    { name: 'Bloody Mary', drunkness: 3 },
    { name: 'Martini', drunkness: 5 },
    { name: 'Scotch', drunkness: 10 }
];
const tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

  res.render('pages/index', {
    drinks,
    tagline
  });
});

//about page
app.get('/about', (req,res) => {
  res.render('pages/about');
});

//server signal
app.listen(PORT, () => {
  console.log(`${PORT} is the magic port`);
});