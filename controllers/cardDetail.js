const GetCardDetail = require("../models/cardDetail");
const AddMoreInfo = require("../models/addMoreInfo");
var nameValidator = /^[a-z A-Z]+$/;
var valid = require("card-validator");
var jwt = require("jsonwebtoken");
var Publishable_Key = 'pk_test_WHeIMWa3jTtSVJX7TEIzLRMU00NpgfAGlx'
var Secret_Key = 'sk_test_oRWGISgDn7Sa9P88qcJ4hEqL00SeLBBefe'
const stripe = require('stripe')(Secret_Key) 

exports.addCard = async(req, res) => {
    const data = req.body;
    const cardName = data.cardName;
    const cardNumber = data.cardNumber;
    const expiryYear = data.expiryYear;
    const expiryMonth = data.expiryMonth;
    const today = new Date();
    const getYear = today.getFullYear();
    const getMonth = today.getMonth()+1;
    const cvv = data.cvv;
    var cardEmail;
    var id;
    if(data !== null){
        if(cardName !== null || cardName !== ""){
            var nameValidation =  nameValidator.test(cardName);
            if(!nameValidation)
            {
                return res.json({
                    status:false,
                    message:"Please Enter Valid Name"
                });
            }
        }
        var numberValidation = valid.number(cardNumber);
        if(numberValidation.isValid == false){
            return res.json({
                status:false,
                message:"Please Enter Valid Card Number!"
            });
        }
        if(expiryYear < getYear){
            return res.json({
                status:false,
                message:"Your card is expire."});
        }
        if(expiryYear == getYear){
            if(expiryMonth < getMonth){
                return res.json({
                    status:false,
                    message:"Your card is expire."
                });
            }
        }
        var regxForCvv = /^\d{3,}$/;
        if(!regxForCvv.test(cvv)){
            return res.json({
                status:false,
                message:"Please Enter Valid CVV number"
            });
        }
        const cardType = numberValidation.card.type;

        await GetCardDetail.findOne({ cardNumber }, async(err, user) => {
            if (err) {
                return res.status(400).json({
                  error: "USER email does not exists"
                });
            }
            else{
                if(user == null){
                    var accessToken = req.headers.authorization;
                    console.log("accessToken",accessToken);
                    var token = accessToken && accessToken.split(' ')[1];
                    if (token == null) 
                        return res.sendStatus(401)
                    else{
                        console.log("token",token)
                        jwt.verify(token, process.env.SECRET, (err, user) => {
                            if (err) return res.sendStatus(403)
                            else{
                                console.log("user.data",user.data);
                                // cardEmail = user.data.email;
                                id = user.data._id;
                                if(id == null || id == undefined || id == ""){
                                    return res.sendStatus(403,"Id not fount");
                                }
                                AddMoreInfo.findById(id,async(err,userDetails)=>{
                                    if (err) return res.sendStatus(403)
                                    else{
                                        console.log("cardEmail",userDetails.email)
                                        cardEmail = userDetails.email;
                                        if(cardEmail == null || cardEmail == undefined || cardEmail == ""){
                                            return res.json({
                                                status:false,
                                                message:"Email id not found"});
                                        }
                                        else{
                                            var param ={};
                                            param.email = cardEmail; //"hardikbhai@gmail.com"
                                            param.name = cardName;
                                            var customerDetailId;
                                            stripe.customers.create(param,function(err,customerData){
                                                if(err){
                                                    // console.log("stripeErr1",err);
                                                    // return res.json(err.statusCode)
                                                    return res.status(statusCode).json({ 
                                                        status:0,
                                                        message:err.StripeCardError
                                                     });
                                                }
                                                else{
                                                    customerDetailId = (customerData);
                                                    // console.log("customerDetailId",customerDetailId);
                                                    customerDetailId = customerDetailId.id;
                                                    // console.log("ID",customerDetailId);
                                                }
                                                //will use retrive 
                                            });  
                                            var param ={};
                                            param.card = {
                                                number: cardNumber,
                                                exp_month: expiryMonth,
                                                exp_year: expiryYear,
                                                cvc:cvv
                                            }
                                            var cardDetailID;
                                            var tokonId;
                                            stripe.tokens.create(param,function(err,tokensData){
                                                if(err){
                                                    // console.log("stripeErr2",err);
                                                    // return res.json(err.statusCode)
                                                    return res.status(statusCode).json({ 
                                                        status:0,
                                                        message:err.StripeCardError
                                                     });
                                                }
                                                else{
                                                    tokenId = (tokensData);
                                                    // console.log("tokensData",tokensData);
                                                    tokenId = tokenId.id;
                                                    cardDetailID = tokensData.card.id;
                                                    // console.log("cardDetailID",cardDetailID);
                                                }
                                            });
                                            setTimeout(()=>{
                                                console.log("customerDetailId",customerDetailId);
                                                stripe.customers.createSource(customerDetailId,{source:tokenId},function(err,cardandCustomer){
                                                if(err){
                                                    // console.log("stripeErr3",err);
                                                    // return res.json(err.statusCode)
                                                    return res.status(statusCode).json({ 
                                                        status:0,
                                                        message:err.StripeCardError
                                                     });
                                                }
                                                else{
                                                    // return res.send(JSON.stringify(cardandCustomer, null, 2));
                                                    const cardDetails = {
                                                        "cardName": cardName,
                                                        "userId": id,
                                                        "expiryMonth": expiryMonth,
                                                        "expiryYear": expiryYear,
                                                        "cardNumber": cardNumber,
                                                        "cardType": cardType,
                                                        "stripeCardId":cardDetailID,
                                                        "stripeCustomerId":customerDetailId,
                                                        "stripeTokonId":tokenId
                                                    }
                                                    const detail = new GetCardDetail(cardDetails);
                                                    detail.save((err, user) => {
                                                        if (err) {
                                                        return res.status(400).json({
                                                            err: "NOT able to save card in DB"
                                                        });
                                                        }
                                                        else{  
                                                            // console.log("user",user);                          
                                                            res.json({
                                                                "status" : 1, 
                                                                "message" : "Add card Successfully.",
                                                                "data": {
                                                                    id : user._id,
                                                                    cardName : user.cardName,
                                                                    userId: user.userId,
                                                                    expiryMonth : user.expiryMonth,
                                                                    expiryYear: user.expiryYear,
                                                                    cardNumber: user.cardNumber,
                                                                    cardType: user.cardType
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                            },5000);
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
                else
                    return res.json({
                        "status" : false, 
                        "message" : "Card Already Exist."
                    });
            }

        });
    }

};

exports.getCards = (req, res) => {
    var modifyData="";

    var accessToken = req.headers.authorization;
    console.log("accessToken",accessToken);
    var token = accessToken && accessToken.split(' ')[1];
    if (token == null) 
        return res.sendStatus(401)
    else{
        console.log("token",token)
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            else{
                id = user.data._id;
                if(id == null || id == undefined || id == ""){
                    return res.json({
                        "status":1, 
                        "message": "Get data Successfully.", 
                        "data":{
                            "list": []
                        }
                    });
                }
                else{
                    console.log("ID",id)
                    GetCardDetail.find({isDelete:false,userId:id}).exec((err, data) => {
                        if (err) {
                            return res.status(400).json({
                            error: "NO Get Card Detail found"
                            });
                        }
                    
                        const reformattedData = data && data.map((item, index) => ({
                            id : item._id,
                            cardName : item.cardName,
                            expiryMonth : item.expiryMonth,
                            expiryYear: item.expiryYear,
                            cardNumber: item.cardNumber,
                            cardType: item.cardType
                        }));
                    
                        modifyData = {
                            "status":1, 
                            "message": "Get data Successfully.", 
                            "data":{
                                "list": reformattedData
                            }
                        }
                        res.json(modifyData);
                    });
                }
            }
        })
    }
};
exports.editCard = (req, res, next) => {
    const data = req.body;
    const cardName = data.cardName;
    // const cardNumber = data.cardNumber;
    const expiryYear = data.expiryYear;
    const expiryMonth = data.expiryMonth;
    const today = new Date();
    const getYear = today.getFullYear();
    const getMonth = today.getMonth()+1;
    const id = data._id;

    if(data !== null){

        GetCardDetail.findOne({"_id":id}, (err, cardDetail) => {
            if (err) {
                return res.status(400).json({
                    error: " Card does not exists"
                });
            }
            if(cardDetail == null){
                return res.json("Card not Exist.")
            }
            else{
                // var numberValidation = valid.number(cardNumber);
                // if(numberValidation.isValid == false){
                //     return res.json("Please Enter Valid Card Number!");
                // }
        
                if(cardName !== null || cardName !== ""){
                    var nameValidation =  nameValidator.test(cardName);
                    if(!nameValidation)
                    {
                        return res.json({
                            status: false,
                            message: "Please Enter Valid Name"
                        });
                    }
                }
        
                if(expiryYear < getYear){
                    return res.json("Your card is expire.");
                }
                if(expiryYear == getYear){
                    if(expiryMonth < getMonth){
                        return res.json("Your card is expire.");
                    }
                }

                var customerDetailId = (cardDetail.stripeCustomerId);
                var cardDetailID = (cardDetail.stripeCardId);
                if(customerDetailId == null || customerDetailId =="" || customerDetailId == undefined){
                    return res.json("Customer Id not found");
                }
                if(cardDetailID == null || cardDetailID =="" || cardDetailID == undefined){
                    return res.json("Customer Id not found");
                }
                setTimeout(()=>{
                    console.log("customerDetailId",customerDetailId,"cardDetailID",cardDetailID)
                    var param ={
                            name: cardName,
                            exp_month: expiryMonth,
                            exp_year: expiryYear,
                        }
                    stripe.customers.updateSource(customerDetailId,cardDetailID,param,function(err,customerData){
                        if(err){
                            return res.status(statusCode).json({ 
                                status:0,
                                message:err.StripeCardError
                             });
                        }
                        else{
                            GetCardDetail.findOneAndUpdate(
                                { _id: data._id },
                                { $set: { cardName: cardName, expiryYear: expiryYear, expiryMonth: expiryMonth } },
                                (err, userUpdate) => {
                                    if (err) {
                                        return res.status(400).json({
                                            error: "Cannot update card"
                                        });
                                    }
                                    else{
                                        console.log("userUpdate",userUpdate);
                                        GetCardDetail.findOne({"_id": userUpdate._id,},(err,data)=>{
                                            if(err){
                                                return res.status(400).json({
                                                    error: "Cannot update card"
                                                });
                                            }
                                            else{
                                                console.log("data",data);
                                                res.json(
                                                    {
                                                        "status" : 1, 
                                                        "message" : "Update card Successfully.",
                                                        "data":
                                                        {
                                                            id : data._id,
                                                            userId: data.userId,
                                                            cardName : data.cardName,
                                                            expiryMonth : data.expiryMonth,
                                                            expiryYear: data.expiryYear,
                                                            cardNumber: data.cardNumber,
                                                            cardType: data.cardType
                                                        }
                                                    }
                                                );
                                                next()
                                            }
                                        });
                                    }
                                }
                            );
                        }
                    });
                },3000);                
            }
        });        
    }
};
exports.deleteCard = (req, res, next) => {
    const data = req.body;
    const id= data.id;
    if(data !== null){
        GetCardDetail.findById(id,(err, cardDetail)=>{
            if (err) {
                return res.status(400).json({
                    error: " Card does not exists"
                });
            }
            else{
                console.log("cardDetail",cardDetail);
                if(cardDetail !== null){
                    if(cardDetail.isDelete === true){
                        console.log(cardDetail.isDelete);
                        return res.json("Card Already Delete");
                    }
                    else{
                        var customerDetailId = (cardDetail.stripeCustomerId);
                        var cardDetailID = (cardDetail.stripeCardId);
                        if(customerDetailId == null || customerDetailId =="" || customerDetailId == undefined){
                            return res.json("Customer Id not found");
                        }
                        if(cardDetailID == null || cardDetailID =="" || cardDetailID == undefined){
                            return res.json("Customer Id not found");
                        }
                        stripe.customers.deleteSource(customerDetailId,cardDetailID,function(err,deleteCard){
                            if(err){
                                console.log("err",err);
                                return res.status(statusCode).json({ 
                                    status:0,
                                    message:err.StripeCardError
                                 });
                            }
                            else{
                                
                                console.log("deleteCard",deleteCard);
                                // return res.json(deleteCard);
                                if(deleteCard.deleted === true){
                                    GetCardDetail.findOneAndUpdate({"_id":id},{ $set: { isDelete: true } }, (err, cardDetail) => {
                                        if (err) {
                                            return res.status(400).json({
                                                error: " Card does not exists"
                                            });
                                        }
                                        else{
                                            return res.json({
                                                "status": 1,
                                                "message": "Card deleted Successfully.",
                                            });
                                        }
                                        next()
                                    });
                                }
                                else{
                                    return res.json({
                                        "status": 1,
                                        "message": "Card Alreday Deleted.",
                                    });
                                }
                            }
                        });
                    }
                }
                else{
                    return res.json({
                        "status": false,
                        "message": "Card Not Found.",
                    });
                }                
            }
        });
        
    }
}; 

exports.setDefaultCard = (req, res) => {
    try{
        const {cardId} = req.body;
        GetCardDetail.findByIdAndUpdate(
            {_id: cardId},
            {$set: {isDefault: true}},
            { new: false, useFindAndModify: false },
            (error, card) => {
                if(error){
                    res.status(400).json({
                        status: 0,
                        message: "Unable to update card.",
                        error
                    });
                }
                res.status(201).json({
                    status: 1,
                    message: 'Card updated successfully'
                });
            }
        )
    }catch(error){
        res.status(400).json({
            status: 0,
            message: "Unable to update card.",
            error
        });
    }
}