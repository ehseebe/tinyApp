const express = require('express');
const app = express();
const PORT = 8080; //default port 8080

//homepage
app.get('/', (req, res) => {
  res.send('Hello!');
});

//test urls
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

//test urls input/output
app.get('/urls.json', (req,res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b><body><html>\n');
});

//server signal
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});