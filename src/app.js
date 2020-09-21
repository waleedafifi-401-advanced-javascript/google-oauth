// 3rd Party Resources
const express = require('express');
const cors = require('cors');

// Esoteric Resources
const oauth = require('./middlewares/oauth.js');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());

// Website Files
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {
    msg: 'You can use google login by clicking on the link below',
  });
});

// Routes
app.get('/oauth', oauth, (req, res) => {
  res.status(200).render('index', {
    token: req.token,
    user: req.user.username,
  });
  // res.status(200).json({ token: req.token, user: req.user.username });
});

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
