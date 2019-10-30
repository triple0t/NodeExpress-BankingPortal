const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

const port = 3001;

// dir
const pathToViewsDir = path.join(__dirname, 'views');
const pathToPublicDir = path.join(__dirname, 'public');
const pathToJsonDir = path.join(__dirname, 'json');

// files
const accountJsonFile = path.join(pathToJsonDir, 'accounts.json');
const userJsonFile = path.join(pathToJsonDir, 'users.json');

const ENCODING = 'utf8';

app.set('views', pathToViewsDir);
app.set('view engine', 'ejs');

app.use(express.static(pathToPublicDir));
app.use(express.urlencoded({ extended: true }));

const accountData = fs.readFileSync(accountJsonFile, ENCODING);
const userData = fs.readFileSync(userJsonFile, ENCODING);

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

    const accountsJSON = JSON.stringify(accounts);

    // writing to file
    fs.writeFileSync(accountJsonFile, accountsJSON, ENCODING);

    return res.render('transfer', { message: 'Transfer Completed' });
  });

  app.get('/payment', (req, res) => res.render('payment', { account: accounts.credit }));
  app.post('/payment', (req, res) => {
    const { amount } = req.body;
    const newAmount = parseInt(amount);
 
    accounts.credit.balance  = parseInt(accounts.credit.balance) - newAmount;
    accounts.credit.available = parseInt(accounts.credit.available) + newAmount;

    const accountsJSON = JSON.stringify(accounts);

    // writing to file
    fs.writeFileSync(accountJsonFile, accountsJSON, ENCODING);

    res.render('payment', { message: "Payment Successful", account: accounts.credit });
  });

// } catch (error) {
//   console.error('Error Parsing File: ', error);
//   throw error;
// }

app.listen(port, () => {
  console.log(`App Server Started on: http://localhost:${port}`);
});