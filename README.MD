#Mail for Spam Node.js module

Provide MailForSpam.com functionality for you Node.js powered applications.

If you want make applications which wants to retrieve emails with some verification codes or links or gets some external notifications from email you can use this module with random account.

##Usage

Install:

``npm i node-mailforspam``

Usage:

```javascript
const Mailforspam = require('.');

//Create module instance
let mail = new Mailforspam('TestAccount');

//Get emails list from first two pages
let emails = [...await mail.list(), ...await mail.list(2)];

//Get first email plain text
let email = await mail.read(emails[0].id, 'text');

//Change account
mail.changeAccount('MyTestAccount2');

```