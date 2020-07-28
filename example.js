const ACCOUNT = 'test';

const Mailforspam = require('.');

let mail = new Mailforspam(ACCOUNT);

(async () => {
    let emails = await mail.list();
    let email = await mail.read(emails[0].id, 'text');

    console.log(email);
})()