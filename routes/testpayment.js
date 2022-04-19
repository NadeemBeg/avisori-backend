const express = require("express");
const router = express.Router();
const stripe = require('stripe')('sk_test_oRWGISgDn7Sa9P88qcJ4hEqL00SeLBBefe');


router.get('/pay', async (req, res) => {
    await stripe.customers.update(
        'cus_JzRmWSc0hQL4Kb',
        {default_source: 'card_1JLStBA3T4vb4HNfr7tjV6Hg'}
    ).then(response => console.log(response))
    .catch(err => console.log('error',err));
      return
    await stripe.charges.create({
        amount: 100,
        currency: 'usd',
        description: 'Example charge',
        customer: 'cus_JzRmWSc0hQL4Kb',
        metadata: {order_id: '6735'},
    }).then(res => console.log("response",res)).catch(err => console.log("error",err));

});
  
module.exports = router;