const fs = require('fs');
const path = require('path');
const express = require('express');
const { accounts, users, writeJSON } = require('./data');

const app = express();

const port = 3001;

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

app.get('/savings', (req, res) => res.render('account', { account: accounts.savings }));
app.get('/checking', (req, res) => res.render('account', { account: accounts.checking }));
app.get('/credit', (req, res) => res.render('account', { account: accounts.credit }));

app.get('/profile', (req, res) => res.render('profile', { user: users[0] }));

app.get('/transfer', (req, res) => res.render('transfer'));
app.post('/transfer', (req, res) => {
  const { from, to, amount } = req.body;
  const newAmount = parseInt(amount);

  // we where asked to use parseInt here but i think it should have been parseFloat
  const balFrom = parseInt(accounts[from].balance);
  const balTo = parseInt(accounts[to].balance);
  
  // we are transfering from one account to another, i.e one account will reduce and another will increase
  // we are removing from here
  const newBalFrom = balFrom - newAmount;
  const newBalTo = balTo + newAmount;

  /*
  console.log(`Transfer: 
  Amount: ${amount}, New Amount: ${newAmount}
  From: ${from}
  Bal From: ${balFrom} - NEW Bal From: ${newBalFrom}
  To: ${to}
  Bal To: ${balTo} - NEW Bal To: ${newBalTo}
  `);
  */

  // rewriting balance now
  accounts[from].balance = newBalFrom;
  accounts[to].balance = newBalTo;

  // writing to file
  writeJSON();

  return res.render('transfer', { message: 'Transfer Completed' });
});

app.get('/payment', (req, res) => res.render('payment', { account: accounts.credit }));
app.post('/payment', (req, res) => {
  const { amount } = req.body;
  const newAmount = parseInt(amount);

  accounts.credit.balance  = parseInt(accounts.credit.balance) - newAmount;
  accounts.credit.available = parseInt(accounts.credit.available) + newAmount;

  // writing to file
  writeJSON();

  res.render('payment', { message: "Payment Successful", account: accounts.credit });
});

app.listen(port, () => {
  console.log(`App Server Started on: http://localhost:${port}`);
});