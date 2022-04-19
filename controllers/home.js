const GetCategory = require("../models/category");
const Getappointment = require("../models/appointment");
const getBookCallModel = require("../models/bookCall");
const AddMoreInfo = require("../models/addMoreInfo");
var jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const Email_detials = require("../config").EMAILS_DETAILS;

// exports.getHomeData = (req, res) => {
//     var upcomingAppointment = [];
//     var userId;
//     var reformattedData;
//     // var accessToken = req.headers['cookie'];
//     // var token = accessToken && accessToken.split('token=')[1];
//     var accessToken = req.headers.authorization;
//     console.log("accessToken",accessToken);
//     var token = accessToken && accessToken.split(' ')[1];
//     if (token == null) 
//         return res.sendStatus(401)
//     else{
//         console.log("token",token)
//         jwt.verify(token, process.env.SECRET, (err, user) => {
//             if (err) return res.sendStatus(403)
//             else{
//                 userId = user.data._id;
//             }
//         });
//     }
                
//     GetCategory.find().exec((err, data) => {
//         if (err) {
//             return res.status(400).json({
//                 error: "Category not found"
//             });
//         }
//         else{
//             reformattedData = data && data.map((item, index) => ({
//                 id:item.categoryId,
//                 image:item.image,
//                 title:item.title
//             }));
//             if(userId == null || userId == "")
//                 // return res.json("User id not Found");
//                 return res.json({
//                     "status": 1,
//                     "message": "Get data Successfully.",
//                     "data": {
//                         "categories": reformattedData,
//                         "upcomingAppointment":upcomingAppointment
//                     }
//                 });
            
//             Getappointment.find(userId,(err,appointData)=>{
//                 if (err) {
//                     return res.json({
//                         "status": 1,
//                         "message": "Get data Successfully.",
//                         "data": {
//                             "categories": reformattedData,
//                             "upcomingAppointment":upcomingAppointment
//                         }
//                     });
//                 }
//                 else{
//                     if(appointData == ""|| appointData == null){
//                         return res.json({
//                             "status": 1,
//                             "message": "Get data Successfully.",
//                             "data": {
//                                 "categories": reformattedData,
//                                 "upcomingAppointment":upcomingAppointment
//                             }
//                         });
//                     }
//                     else{
//                             for(let i = 0; i < appointData.length; i++){
//                                 var id = appointData[i].advisorId;  
//                                 var date = appointData[i].startDate;
//                                 var forSameDate = date.toDateString();
//                                 if(date >= new Date() || forSameDate == new Date().toDateString()){
//                                     AddMoreInfo.findOne({_id:id},(err,data1)=>{
//                                         if (err) {
//                                             return res.json({
//                                                 "status": 1,
//                                                 "message": "Get data Successfully.",
//                                                 "data": {
//                                                     "categories": reformattedData,
//                                                     "upcomingAppointment":upcomingAppointment
//                                                 }
//                                             });
//                                         }
//                                         else{
//                                             var date = appointData[i].startDate;
//                                             var setDate = date.toDateString();
//                                             var startTime = appointData[i].startTime;
//                                             var findHour = startTime.split(":")[0];
//                                             var ampm = findHour >= 12 ? 'pm' : 'am';
                                            
//                                             upcomingAppointment.push({
//                                                 "dateTime":setDate+" | "+startTime+" "+ampm,
//                                                 "name":data1.firstName+" "+ data1.lastName,
//                                                 "userId":data1._id,
//                                                 "type":data1.advisorType,
//                                                 "image":data1.profilePic,
//                                             });                                        
//                                         }
//                                     });            
//                                 }                             
                                    
//                             }
                        
//                         setTimeout(()=>{
//                             res.json({
//                                 "status": 1,
//                                 "message": "Get data Successfully.",
//                                 "data":{
//                                     "categories":reformattedData,
//                                     "upcomingAppointment":upcomingAppointment
//                                 }
//                             });
//                         },8000) 
//                     }
                    
//                 }
//             });
//         }
//     });
// };

exports.getHomeData = async(req, res) => {
    var upcomingAppointment = [];
    var userId;
    var reformattedData;
    // var accessToken = req.headers['cookie'];
    // var token = accessToken && accessToken.split('token=')[1];
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
                userId = user.data._id;
            }
        });
    }
                
    await GetCategory.find().exec(async(err, data) => {
        if (err) {
            return res.status(400).json({
                error: "Category not found"
            });
        }
        else{
            reformattedData = data && data.map((item, index) => ({
                id : item._id,
                categoryId:item.categoryId,
                image:item.image,
                title:item.title
            }));
            if(userId == null || userId == "")
                // return res.json("User id not Found");
                return res.json({
                    "status": 1,
                    "message": "Get data Successfully.",
                    "data": {
                        "categories": reformattedData,
                        "upcomingAppointment":upcomingAppointment
                    }
                });
                await getBookCallModel.find({"userId":userId},async(err,appointData)=>{
                if (err) {
                    return res.json({
                        "status": 1,
                        "message": "Get data Successfully.",
                        "data": {
                            "categories": reformattedData,
                            "upcomingAppointment":upcomingAppointment
                        }
                    });
                }
                else{
                    if(appointData == ""|| appointData == null){
                        return res.json({
                            "status": 1,
                            "message": "Get data Successfully.",
                            "data": {
                                "categories": reformattedData,
                                "upcomingAppointment":upcomingAppointment
                            }
                        });
                    }
                    else{
                        for(let i = 0; i < appointData.length; i++){
                            var id = appointData[i].advisorId;  
                            var date = appointData[i].caseDate;
                            console.log("DATE",date);
                            var forSameDate = new Date(date);
                            if(forSameDate >= new Date().setHours(0,0,0,0)){
                                console.log("forSameDate",forSameDate);
                                await AddMoreInfo.findOne({_id:id},(err,data1)=>{
                                    if (err) {
                                        console.log("err",err);
                                        return res.json({
                                            "status": 1,
                                            "message": "Get data Successfully.",
                                            "data": {
                                                "categories": reformattedData,
                                                "upcomingAppointment":upcomingAppointment
                                            }
                                        });
                                    }
                                    else{
                                        var date = appointData[i].caseDate;
                                        var setDate = date;
                                        var startTime = appointData[i].caseTime;
                                        var findHour = startTime.split(":")[0];
                                        var ampm = findHour >= 12 ? 'pm' : 'am';
                                        
                                        upcomingAppointment.push({
                                            // "dateTime":setDate+" | "+startTime+" "+ampm,
                                            "dateTime":setDate+" | "+startTime,
                                            "name":data1.firstName+" "+ data1.lastName,
                                            "userId":data1._id,
                                            "type":data1.advisorType,
                                            "image":data1.profilePic,
                                        });                                        
                                    }
                                });            
                            }                             
                                
                        }
                        setTimeout(()=>{
                            res.json({
                                "status": 1,
                                "message": "Get data Successfully.",
                                "data":{
                                    "categories":reformattedData,
                                    "upcomingAppointment":upcomingAppointment
                                }
                            });
                        },3000);
                    }
                }
            });
        }
    });
};


exports.contactUs = (req, res) => {
    const emailData = req.body;
    const email = emailData.email;
    const description = emailData.description;
    const mobile = emailData.mobile;
    const address = emailData.address;
    
    if(email == null | email == ""){
        return res.json("Email Id Not Found");
    }
    else{
        
        var smtpTransport = nodemailer.createTransport({
            host : Email_detials.HOST_NAME,
            secureConnection : Email_detials.SECURE_CONNECTION,
            port: Email_detials.PORT,
            auth : {
                user : Email_detials.USER,
                pass : Email_detials.PASSWORD    
            }
        });
        var mailOptionsNoAttachment={
            from: Email_detials.USER,
            to : email,
            subject : "Testing email" ,
            text : description+" "+address+" "+mobile
        }
        smtpTransport.sendMail(mailOptionsNoAttachment, function(error, response){
        if(error){
            console.log(error);
            res.json("Email not sent.");
        }
        else{
            res.json({
                "status": 1,
                "message": "Email sent Successfully."
            });
        }
        });
    }   
};