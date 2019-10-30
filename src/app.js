const fs = require('fs');
const path = require('path');
const express = require('express');
const { accounts, users, writeJSON } = require('./data');

// routes
const accountRoutes = require('./routes/accounts');
const servicesRoutes = require('./routes/services');

const app = express();

const port = 3000;

// dir
const pathToViewsDir = path.join(__dirname, 'views');
const pathToPublicDir = path.join(__dirname, 'public');

app.set('views', pathToViewsDir);
app.set('view engine', 'ejs');

app.use(express.static(pathToPublicDir));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return res.render('index', {title: 'Account Summary', accounts});
});

app.use('/account', accountRoutes);

app.get('/profile', (req, res) => res.render('profile', { user: users[0] }));

app.use('/services', servicesRoutes);

app.listen(port, () => {
  console.log(`App Server Started on: http://localhost:${port}`);
});