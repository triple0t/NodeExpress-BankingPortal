const fs = require('fs');
const path = require('path');


// dir
const pathToJsonDir = path.join(__dirname, 'json');

// files
const accountJsonFile = path.join(pathToJsonDir, 'accounts.json');
const userJsonFile = path.join(pathToJsonDir, 'users.json');

const ENCODING = 'utf8';

const accountData = fs.readFileSync(accountJsonFile, ENCODING);
const userData = fs.readFileSync(userJsonFile, ENCODING);

// PluralSight will not pass the tests with the try/ catch block included
// try {

  const accounts = JSON.parse(accountData);
  const users = JSON.parse(userData);

  const writeJSON = () => {
    const accountsJSON = JSON.stringify(accounts);

    // writing to file
    fs.writeFileSync(accountJsonFile, accountsJSON, ENCODING);
  }

  module.exports = { accounts, users, writeJSON }

// } catch (error) {
//   console.error('Error Parsing File: ', error);
//   throw error;
// }
