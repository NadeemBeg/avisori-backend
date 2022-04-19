const stripe = require('stripe')('sk_test_oRWGISgDn7Sa9P88qcJ4hEqL00SeLBBefe');
const CardDetail = require('../models/cardDetail');

exports.getCardDetail = async (req, res, next) => {
    try{
        await CardDetail.findById(req.cardId).exec((error, card) => {
            if(error){
                res.status(400).json({
                    status: 0 ,
                    message: "Card not found.",
                    error
                })
                req.stripeCustomerId = card.stripeCustomerId;
                req.stripeCardId = card.stripeCardId;
                next();
            }
        });
    }catch(error){
        res.status(419).json({
            status: 0 ,
            message: "Something wents wrong",
            error
        })
    }
}

exports.updateCustomerCard = async (req, res, next) => {
    try{
        await stripe.customers.update(
            req.stripeCustomerId,
            {default_source: req.stripeCardId}
        ).then(response => {
            next();
        })
        .catch(error => {
            res.status(500).json({
                status: 0,
                message: "Something wents wrong",
                error
            });
        });
    }
    catch(error){
        res.status(419).json({
            status: 0 ,
            message: "Something wents wrong",
            error
        })
    }
}

exports.makePayment = async (req, res, next) => {
    try{
        const {total} = req.body;
        await stripe.charges.create({
            amount: total*100,
            currency: 'usd',
            description: 'Payment for bookCall',
            customer: req.stripeCustomerId,
            metadata: {order_id: '6735'},
        })
        .then(result => {
            req.transactionId = result.id;
            next();
        })
        .catch(error => {
            res.status(419).json({
                status: 0 ,
                message: "Something wents wrong",
                error
            })
        });
    }catch(error){
        res.status(419).json({
            status: 0 ,
            message: "Something wents wrong",
            error
        })
    }
}