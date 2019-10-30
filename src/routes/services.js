const express = require('express');
const { accounts, writeJSON } = require('../data');

const router = express.Router();

router.get('/transfer', (req, res) => res.render('transfer'));
router.post('/transfer', (req, res) => {
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

router.get('/payment', (req, res) => res.render('payment', { account: accounts.credit }));
router.post('/payment', (req, res) => {
  const { amount } = req.body;
  const newAmount = parseInt(amount);

  accounts.credit.balance  = parseInt(accounts.credit.balance) - newAmount;
  accounts.credit.available = parseInt(accounts.credit.available) + newAmount;

  // writing to file
  writeJSON();

  res.render('payment', { message: "Payment Successful", account: accounts.credit });
});

module.exports = router;