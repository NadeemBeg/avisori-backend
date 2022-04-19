const AddMoreInfo = require("../models/addMoreInfo");
var jwt = require("jsonwebtoken");
var emailValidator = require("email-validator");
var PhoneNumberValidator = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

exports.loginUser = (req, res) => {
    console.log("1");
    const findData = req.body;
    const bankId = findData.bankId;
    if(bankId == null || bankId == "" || bankId == undefined){
        return res.json({
            status:false,
            message:"Please Enter Bank ID"
        })
    }
    else{
        AddMoreInfo.findOne({"bankId":bankId},(err,data)=>{
            if(err){
                return res.sendStatus(403)
            }
            else{
                console.log("data",data);
                if(data == "" || data == null){
                    AddMoreInfo.insertMany(findData,(err, user1) => {
                        if (err) {
                            console.log("err",err);
                            return res.status(400).json({
                                err: "NOT able to save user in DB "
                            });
                        }
                        console.log("user1",user1[0]);
                        var id = user1[0]._id;
                        AddMoreInfo.findByIdAndUpdate( id,{ $set: { isOnline: 1}},(err, user) => {
                            //create token
                            console.log("user",user);
                            const token = jwt.sign({ data: user }, process.env.SECRET);
                            console.log("token",token);
                            res.json({
                                "status" : 1, 
                                "message" : "Get data Successfully.",
                                "data":user.set('token', token)
                            });
                        });
                    });
                }
                else{
                    var id = data._id;
                    AddMoreInfo.findByIdAndUpdate({ _id: id },{ $set: { isOnline: 1}},(err, user2) => {
                        if (err) {
                            console.log(err);                        
                            return res.status(400).json({
                            err: "NOT able to save user in DB"
                            });
                        }
                        //create token
                        console.log("process.env.SECRET2",process.env.SECRET);
                        const token = jwt.sign({ data: user2 }, process.env.SECRET);
                        //put token in cookie
                        // res.cookie("token", token, { expire: new Date() + 9999 });
                        res.json({
                            "status" : 1, 
                            "message" : "Get data Successfully.",
                            "data":user2.set('token', token)
                        });
                    });
                }  
            }
        })
    }
    
};
exports.getProfile = (req, res, next) => {
    var accessToken = req.headers.authorization;
    console.log("accessToken",accessToken);
    var token = accessToken && accessToken.split(' ')[1];
    if (token == null) 
        return res.sendStatus(401)
    else{
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            else{
                var userDetail = user.data;
                var id = user.data._id;
                AddMoreInfo.findById(id,(err,userDetails)=>{
                    if(err) 
                        return res.sendStatus(401)
                    else{
                        var getProfileData ={
                            status : 1, 
                            message : "Get data Successfully.",
                            data :{
                                "userId" : userDetails._id,
                                "profilePic" : userDetails.profilePic,
                                "email": userDetails.email,
                                "mobile":userDetails.phoneNumber,
                                "firstName": userDetails.firstName,
                                "lastName": userDetails.lastName,
                                "userType" : userDetails.userType,
                                "organisationNumber" : userDetails.organisationNumber,
                                "token":token
                            }
                        }
                        return res.json(getProfileData);
                    }
                });
            }
        });
    }
};
exports.updateProfile = (req, res, next) => {
    const forUpdateData = req.body;
    var email = forUpdateData.email;
    var phoneNumber = forUpdateData.phoneNumber;
    var organisationNumber = forUpdateData.organisationNumber;

    if(phoneNumber !== undefined || phoneNumber !== null || phoneNumber !== ""){
        var phoneNumberValidation = PhoneNumberValidator.test(phoneNumber);

        if(!phoneNumberValidation){
            return res.json({
                status:false,
                message:"Please Enter Valid Phone Number."
            });
        }
    }

    var accessToken = req.headers.authorization;
    console.log("accessToken",accessToken);
    var token = accessToken && accessToken.split(' ')[1];
    if (token == null) 
        return res.sendStatus(401)
    else{
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            else{
                if(user !== null){
                    // console.log("user",user);
                    var userDetail = user.data;
                    console.log("userDetail",userDetail);
                    //email Validation
                    
                    var emailValidation = emailValidator.validate(email);
        
                    if(!emailValidation)
                        return res.json({
                            status:false,
                            message:"Please Enter Valid Email."});

                    AddMoreInfo.findOne({ email }, (err, user) => {
                        if (err) {
                            return res.status(400).json({
                                error: "USER email does not exists"
                            });
                        }
                        if(user !== null){
                            // return res.json("Email ID Already Exist.")

                            AddMoreInfo.findOneAndUpdate({ _id: userDetail._id },
                            { $set: { phoneNumber: phoneNumber, organisationNumber: organisationNumber} },
                            (err, userUpdate) =>{
                                if (err) {
                                    return res.status(400).json({
                                        error: "Cannot update user"
                                    });
                                }
                                else{
                                    AddMoreInfo.findOne({_id: userUpdate._id,},(err,data)=>{
                                        if(err){
                                            return res.status(400).json({
                                                error: "Cannot update user"
                                            });
                                        }
                                        else{
                                            res.json({
                                                status : 1, 
                                                message : "Data updated Successfully",
                                                // "data":userResDetails.set("token",token)
                                                data:{
                                                    "userId" : data._id,
                                                    "profilePic" :data.profilePic,
                                                    "email":data.email,
                                                    "mobile":data.phoneNumber,
                                                    "firstName":data.firstName,
                                                    "lastName":data.lastName,
                                                    "userType" :data.userType,
                                                    "organisationNumber" :data.organisationNumber,
                                                    "token": token
                                                }
                                            });
                                            next()
                                        }
                                    });
                                }
                            });
                        }
                        else{
                            AddMoreInfo.findOneAndUpdate(
                                { _id: userDetail._id },
                                { $set: { email: email, phoneNumber: phoneNumber, organisationNumber: organisationNumber} },
                                (err, userUpdate) => {
                                    if (err) {
                                        return res.status(400).json({
                                            error: "Cannot update user"
                                        });
                                    }
                                    console.log("userUpdate",userUpdate);
                                    AddMoreInfo.findOne({_id: userUpdate._id,},(err,data)=>{
                                        if(err){
                                            return res.status(400).json({
                                                error: "Cannot update user"
                                            });
                                        }
                                        else{
                                            res.json({
                                                status : 1, 
                                                message : "Data updated Successfully",
                                                // "data":userResDetails.set("token",token)
                                                data:{
                                                    "userId" : data._id,
                                                    "profilePic" :data.profilePic,
                                                    "email":data.email,
                                                    "mobile":data.phoneNumber,
                                                    "firstName":data.firstName,
                                                    "lastName":data.lastName,
                                                    "userType" :data.userType,
                                                    "organisationNumber" :data.organisationNumber,
                                                    "token": token
                                                }
                                            });
                                            next()
                                        }
                                    });
                                }
                            );
                        }
                    });
                }
                else{
                    return res.json({
                        status:0,
                        message:"User Null"
                    });
                }
            }
        });
    }   
}