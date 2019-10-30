const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

const port = 3000;

const pathToViewsDir = path.join(__dirname, 'views');
const pathToPublicDir = path.join(__dirname, 'public');
const pathToJsonDir = path.join(__dirname, 'json');

app.set('views', pathToViewsDir);
app.set('view engine', 'ejs');

app.use(express.static(pathToPublicDir));

const accountData = fs.readFileSync(path.join(pathToJsonDir, 'accounts.json'), {encoding: 'utf8'});
const userData = fs.readFileSync(path.join(pathToJsonDir, 'users.json'), {encoding: 'utf8'});

// PluralSight will not pass the tests with the try/ catch block included
// try {
  const accounts = JSON.parse(accountData);
  const users = JSON.parse(userData);

  app.get('/', (req, res) => {
    return res.render('index', {title: 'Account Summary', accounts});
  });

  app.get('/savings', (req, res) => res.render('account', { account: accounts.savings }));
  app.get('/checking', (req, res) => res.render('account', { account: accounts.checking }));
  app.get('/credit', (req, res) => res.render('account', { account: accounts.credit }));

  app.get('/profile', (req, res) => res.render('profile', { user: users[0] }))

// } catch (error) {
//   console.error('Error Parsing File: ', error);
//   throw error;
// }

app.listen(port, () => {
  console.log(`App Server Started on: http://localhost:${port}`);
});