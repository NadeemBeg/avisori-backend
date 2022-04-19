const axiosLib = require('axios');
const fs = require('fs');
const https = require('https');
const to = require('await-to-js').to;
const express = require("express");
const router = express.Router();
const {settings} = require('../config');
const BankId = require("bankid");


router.get('/bank', (req, res) =>{
    // console.log('test');
    const client = new BankId.BankIdClient({
        production: false,
        pfx: settings.pfx, // alternatively also accepts buffer
        passphrase: settings.passphrase,
    });

    // const client = new BankId.BankIdClient();
    const pno = "199311011234";
    const message = "some message displayed to the user to sign";
    client
    .sign({
        endUserIp: "185.198.6.16",
        // personalNumber: pno,
        userVisibleData: message,
    })
    .then(data => {
        res.status(201).json({
          status: 1,
          data
        })
    })
    .catch(console.error);

     
}); 

router.post('/collect',(req, res) => {
  const {orderRef} = req.body;
  const collect = async orderRef => await call('collect', {orderRef});
  res.json({collect});
})

const axios = axiosLib.create({
  httpsAgent: new https.Agent({
    pfx: settings.pfx,
    passphrase: settings.passphrase,
    ca: settings.ca,
  }),
  headers: {
    'Content-Type': 'application/json',
  },
});

// This is a wrapper that will be used for all calls to BankID
async function call (method, params) {
  const [error, result] = await to(
    axios.post(`${settings.bankdIdUrl}/${method}`, params));

  if (error) {
    // You will want to implement your own error handling here
    console.error('Error in call');
    if (error.response && error.response.data) {
      console.error(error.response.data);
      if (error.response.data.errorCode === 'alreadyInProgress') {
        console.error('You would have had to call cancel on this orderRef before retrying');
        console.error('The order should now have been automatically cancelled by this premature retry');
      }
    }
    return {error};
  }

  return result.data;
}

router.get('/auth', async (req, res) => {
  let endUserIp = "185.198.6.16";
  let response = await call('auth',{endUserIp});
  res.status(201).json({
    status: 1,
    data: response
  });
})

module.exports = router;