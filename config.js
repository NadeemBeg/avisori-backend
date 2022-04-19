const fs = require('fs');

exports.EMAILS_DETAILS = {
    HOST_NAME: 'smtp.gmail.com',
    SECURE_CONNECTION: false,
    PORT: 587,
    USER: 'nadeem.beg@ifuturz.com',
    PASSWORD: '#JsDepart',   
};

exports.settings = {
    mobileBankIdPolicy: '1.2.3.4.25',
    bankdIdUrl: 'https://appapi2.test.bankid.com/rp/v5.1',
    refreshInterval: 1000, // how often to poll status changes for authenticateAndCollect and signAndCollect
    production: true, // use test environment
    pfx: fs.readFileSync("./cert/FPTestcert3_20200618.p12"), // test environment
    passphrase: "qwerty123", // test environment
    ca: fs.readFileSync("./cert/test.ca"), // dynamically set depending on the "production" setting unless explicitely provided
};
