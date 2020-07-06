const express = require('express');
const app = express();
const PORT = 8080; //default port 8080

//set view engine to ejs
app.set('view engine', 'ejs');

//index page
app.get('/', (req, res) => {
  res.render('pages/index');
});

//about page
app.get('/about', (req,res) => {
  res.render(pages/about);
});

//server signal
app.listen(PORT, () => {
  console.log(`${PORT} is the magic port`);
});