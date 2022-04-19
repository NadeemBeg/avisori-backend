const AddMoreInfo = require("../models/addMoreInfo");
const GetLanguage = require("../models/language");
const GetcompanyData = require("../models/company");
const GetCategory = require("../models/category");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var emailValidator = require("email-validator");
var PhoneNumberValidator = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
var nameValidator = /^[a-zA-Z]+$/;

exports.addNewuser = async(req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
          error: errors.array()[0].msg
        });
    }
    const newUser = new AddMoreInfo(req.body);
    const email = newUser.email;
    const phoneNumber = newUser.phoneNumber;
    const firstName = newUser.firstName;
    const lastName = newUser.lastName;
    const speciality = newUser.speciality;
    const languages = newUser.languages;
    const profilePic = newUser.profilePic;
    const userType = newUser.userType;
    const advisorType = newUser.advisorType;
    const organisationNumber =newUser.organisationNumber;
    var companyId = newUser.companyId;
    
    var emailValidation = await emailValidator.validate(email);
    if(!emailValidation)
        return res.json({
            status:false,
            message:"Please Enter Valid Email."});

    AddMoreInfo.findOne({ email },(err, user) => {
        var companyName;
        if (err) {
            return res.status(400).json({
                error: "USER email does not exists"
            });
        }
        else{
            if(user !== null){
                return res.json({
                    status:0,
                    message:"Email Already Exist."
                });
            }
            else{
                var accessToken = req.headers.authorization;
                console.log("accessToken",accessToken);
                var token = accessToken && accessToken.split(' ')[1];
                if (token == null) 
                    return res.sendStatus(401)
                else{
                    console.log("token",token, process.env.SECRET)
                    jwt.verify(token, process.env.SECRET, (err, user) => {
                        if (err) {
                            console.log("err",err);
                            return res.sendStatus(403)}
                        else{
                            console.log(user);
                            var tokenDataForId = user.data._id;
                            console.log("tokenDataForId",tokenDataForId)
                            var profileCompleted = user.data.profileCompleted;
                            console.log("profileCompleted",profileCompleted);
                            if(profileCompleted > 0 && profileCompleted == 1){
                                return res.json({
                                    status:0,
                                    message:"Profile already completed."
                                });
                            }
                            else{
                                if(phoneNumber !== undefined || phoneNumber !== null || phoneNumber !== ""){
                                    console.log("phoneNumber",phoneNumber);
                                    var phoneNumberValidation = PhoneNumberValidator.test(phoneNumber);
                                    console.log("phoneNumberValidation",phoneNumberValidation);
                                    if(!phoneNumberValidation){
                                        return res.json({
                                            status:false,
                                            message:"Please Enter Valid Phone Number."
                                        });
                                    }
                                }
                                if(firstName !== null || firstName !== ""){
                                    var nameValidation =  nameValidator.test(firstName);
                                    if(!nameValidation)
                                    {
                                        return res.json({
                                            status:false,
                                            message:"Please Enter Valid First Name"
                                        });
                                    }
                                }
                                if(lastName !== null || lastName !== ""){
                                    var nameValidation =  nameValidator.test(lastName);
                                    if(!nameValidation)
                                    {
                                        return res.json({
                                            status:false,
                                            message:"Please Enter Valid Last Name"
                                        });
                                    }
                                }
                                if(speciality !== null || speciality !== "" || speciality !== undefined){
                                    console.log(speciality);
                                }
                                console.log("companyId",companyId);
                                if(companyId !=null && companyId !== "" && companyId !== undefined){
                                    GetcompanyData.findOne({_id:companyId},(err,companyId1)=>{
                                        console.log("companyId1",companyId1);
                                        if(companyId1 == null){
                                            return res.json({
                                                status:false,
                                                message:"Please Enter Valid CompanyID or Name"
                                            });
                                        }
                                        else{
                                            companyId =companyId1._id;
                                            AddMoreInfo.findByIdAndUpdate(
                                                {_id:tokenDataForId},
                                                {$set:
                                                    {
                                                        profilePic:profilePic,
                                                        email:email,
                                                        firstName:firstName,
                                                        lastName:lastName,
                                                        phoneNumber:phoneNumber,
                                                        speciality:speciality,
                                                        languages:languages,
                                                        userType:userType,
                                                        advisorType:advisorType,
                                                        companyId:companyId,
                                                        organisationNumber:organisationNumber,
                                                        isOnline:1,
                                                        profileCompleted:1
                                                    }
                                                },
                                                (err,updateData)=>{
                                                    console.log("updateDate1",updateData);
                                                if (err) {
                                                    console.log("err",err);
                                                    return res.status(400).json({
                                                    err: "NOT able to save user in DB"
                                                    });
                                                }
                                                else{
                                                    AddMoreInfo.findById({_id:tokenDataForId},(err,updateUserData)=>{
                                                        if (err) {
                                                            console.log("err",err);
                                                            return res.status(400).json({
                                                            err: "NOT able to save user in DB"
                                                            });
                                                        }
                                                        else{
                                                            res.json({
                                                                "status" : 1, 
                                                                "message" : "User Successfully Add.",
                                                                "data":updateUserData
                                                            });
                                                        }
                                                    });
                                                    // setTimeout(()=>{
                                                         
                                                    // },30000);
                                                }
                                            });
                                        }
                                    });                                    
                                }
                                else{
                                    AddMoreInfo.findByIdAndUpdate(
                                        {_id:tokenDataForId},
                                        {$set:
                                            {
                                                profilePic:profilePic,
                                                email:email,
                                                firstName:firstName,
                                                lastName:lastName,
                                                phoneNumber:phoneNumber,
                                                speciality:speciality,
                                                languages:languages,
                                                userType:userType,
                                                advisorType:advisorType,
                                                organisationNumber:organisationNumber,
                                                isOnline:1,
                                                profileCompleted:1
                                            }
                                        },
                                        (err,updateData)=>{
                                            console.log("updateDate2",updateData);
                                        if (err) {
                                            console.log("err",err);
                                            return res.status(400).json({
                                            err: "NOT able to save user in DB"
                                            });
                                        }
                                        else{
                                            AddMoreInfo.findById({_id:tokenDataForId},(err,updateUserData)=>{
                                                if (err) {
                                                    console.log("err",err);
                                                    return res.status(400).json({
                                                    err: "NOT able to save user in DB"
                                                    });
                                                }
                                                else{
                                                    res.json({
                                                        "status" : 1, 
                                                        "message" : "Get data Successfully.",
                                                        "data":updateUserData
                                                    });
                                                }
                                            });
                                            // setTimeout(()=>{
                                            //     res.json({
                                            //         "status" : 1, 
                                            //         "message" : "Get data Successfully.",
                                            //         "data":updateData
                                            //     });
                                            // },30000);
                                        }
                                    });
                                }
                                
                            }
                        }
                    });
                }
            }
        }
    });
}

exports.getAllUser = (req, res) => {
	var modifyData="";
    AddMoreInfo.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "NO AddMoreInfo found"
      });
    }
    modifyData = {
    	"status":1, 
     	"message": "Get data Successfully.", 
     	"data":data
    }    
    res.json(modifyData);
  });
};
exports.changeNotification=(req, res)=>{
    const CNData = req.body;
    const status = CNData.status;
    

    var accessToken = req.headers.authorization;
    console.log("accessToken",accessToken);
    var token = accessToken && accessToken.split(' ')[1];
    if (token == null) 
        return res.sendStatus(401)
    else{
        console.log("token",token, process.env.SECRET)
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                console.log("err",err);
                return res.sendStatus(403)}
            else{
                console.log(user);
                var tokenDataForId = user.data._id;
                console.log("tokenDataForId",tokenDataForId)
                if(tokenDataForId == null || tokenDataForId == ""){
                    return res.json({
                        status:false,
                        message:"Please Enter user id"
                    });
                }
                else{
                    AddMoreInfo.findByIdAndUpdate({ _id: tokenDataForId },{ $set: { notificationStatus: status}},(err, user) => {
                        if (err) {
                            return res.status(400).json({
                                status:false,
                                message:"Please Enter user id"
                            });
                        }
                        else{
                            return res.json({
                                "status": 1,
                                "message": "Status changed Successfully."
                            });
                        }
                    });
                }
            }
        });
    }
};
exports.listAdvisors= async(req, res)=>{
    const reqData = req.body;
    var subCategoryId = reqData.subCategoryId;
    var languageId = reqData.languageId;
    var subCategoryName;
    var languageName;
    var limit = reqData.limit;
    var page = reqData.page;
    var finalArray = [];
    var langIcons = [];

    // if(subCategoryId == undefined || subCategoryId == null){
    //     return res.json({
    //         status:false,
    //         message:"Please Enter Sub Category ID"
    //     });
    // }
    // if(languageId == undefined || languageId == null){
    //     return res.json({
    //         status:false,
    //         message:"Please Enter Language ID"
    //     })
    // }
    // if(limit == undefined || limit == null){
    //     limit = 20
    // }
    // if(page > 1){
    //     if(limit == undefined || limit == null){
    //         page = limit
    //     }
    //     else{
    //         page = 20
    //     }
    // }
    await AddMoreInfo.find({ advisorType: { $exists: true,$ne: null } },async(err,data)=>{
        if (err) {
            return res.status(400).json({
                status:false,
                message: "Data not found"
            });
        }
        else{
            if(data == null){
                return res.status(400).json({
                    status:false,
                    message: "Data not found"
                });
            }
            else{
                // console.log("data",data);
                if(data.length>0){
                    for(let i = 0; i<data.length; i++){
                        var languageArr = data[i].languages;
                        // setTimeout(()=>{
                            // for(let j = 0; j < languageArr.length; j++){
                                // let languageName = languageArr[j];
                                console.log("languageArr",languageArr);
                                await GetLanguage.find({name:{ $in:languageArr}},async(err,languageData)=>{
                                    // console.log(languageData)
                                    // let languageimage = languageData.image;
                                    if (err) {
                                        return res.status(400).json({
                                            error: "You are not authorized to update this user"
                                        });
                                    }
                                    else{
                                        for(let j = 0; j < languageData.length; j++){
                                            let image = languageData[j].image;
                                            langIcons.push({
                                                image:image
                                            });
                                            // console.log("langIcons",langIcons)
                                        }
                                        // console.log("langIcons",langIcons);
                                        finalArray.push({
                                            id:data[i]._id,
                                            name:data[i].firstName+" "+data[i].lastName,
                                            image:data[i].profilePic,
                                            rating:data[i].rating,
                                            isOnline:data[i].isOnline,
                                            languageIcons:langIcons,
                                        });
                                        langIcons = []
                                    }
                                });                        
                            // }
                        // },1000);
                        
                    }
                    // setTimeout(()=>{
                        return res.json({
                            "status": 1,
                            "message": "Get data Successfully.",
                            "data":{
                                "totalRecords": data.length,
                                "list": finalArray
                            }
                            
                        });
                    // },1000);
                }
                else{
                    return res.status(400).json({
                        status:false,
                        message: "Data not found"
                    });
                }
            }
        }
    });

    // language and category condition in below code
    
    // GetCategory.findById(subCategoryId,(err,subCategoryData)=>{
    //     if (err) {
    //         return res.status(400).json({
    //             status:false,
    //             message: "sub category data not found"
    //         });
    //     }
    //     else{
    //         if(subCategoryData !== null){
    //             subCategoryName = subCategoryData.title;
    //             GetLanguage.findById(languageId,(err,languageData)=>{
    //                 if (err) {
    //                     return res.status(400).json({
    //                         status:false,
    //                         message: "Language data not found"
    //                     });
    //                 }
    //                 else{
    //                     if(languageData !== null){
    //                         languageName = languageData.name;
    //                         AddMoreInfo.find({speciality:{$in:subCategoryName},languages:{$in:languageName} },(err,data)=>{
    //                             if (err) {
    //                                 return res.status(400).json({
    //                                     error: "You are not authorized to update this user"
    //                                 });
    //                             }
    //                             else{
    //                                 if(data.length > 0){
    //                                     for(let i = 0; i < data.length; i++){
    //                                         var languageArr = data[i].languages;
    //                                         setTimeout(()=>{
    //                                             for(let j = 0; j < languageArr.length; j++){
    //                                                 let languageName = languageArr[j];
    //                                                 GetLanguage.findOne({name:languageName},(err,languageData)=>{
    //                                                     let languageimage = languageData.image;
    //                                                     if (err) {
    //                                                         return res.status(400).json({
    //                                                             error: "You are not authorized to update this user"
    //                                                         });
    //                                                     }
    //                                                     else{
    //                                                         langIcons.push({
    //                                                             image:languageimage
    //                                                         });
    //                                                     }
    //                                                 });                        
    //                                             }
    //                                         },3000); 
    //                                         console.log(i,"langIcons",langIcons)                   
    //                                         finalArray.push({
    //                                             id:data[i]._id,
    //                                             name:data[i].firstName+" "+data[i].lastName,
    //                                             image:data[i].profilePic,
    //                                             rating:data[i].rating,
    //                                             isOnline:data[i].isOnline,
    //                                             languageIcons:langIcons,
    //                                         });
    //                                     }
    //                                 }
    //                                 else{
    //                                     return res.json({
    //                                         status:false,
    //                                         message:"Data Not Found"});
    //                                 }            
    //                                 setTimeout(()=>{
    //                                     return res.json({
    //                                         "status": 1,
    //                                         "message": "Get data Successfully.",
    //                                         "data":{
    //                                             "totalRecords": data.length,
    //                                             "list": finalArray
    //                                         }
                                            
    //                                     });
    //                                 },5000);
    //                             }
    //                         }).limit(limit).skip(0);
    //                     }
    //                     else{
    //                         return res.json({
    //                             status:false,
    //                             message: "Language data not found"
    //                         });
    //                     }
    //                 }
    //             });
    //         }
    //         else{
    //             return res.json({
    //                 status:false,
    //                 message: "sub category data not found"
    //             });
    //         }
    //     }
    // });    
};

exports.viewAdvisor=async(req, res)=>{
    const data = req.body;
    const id = data.advisorId
    const specialityArr = [];
    const langIcons = [];
    

    if(id == ""|| id == null){
        return res.json({
            status: false,
            message:"Please Send advisor Id"
        });
    }
    else{
        await AddMoreInfo.findById((id),async(err,advisorData)=>{
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: "Advisor Not Found"
                });
            }
            else{
                var speciality = advisorData.speciality;
                if(speciality.length >0){
                    for(let i= 0; i< speciality.length; i++){
                        specialityArr.push({
                            name:speciality[i]
                        })
                    }
                }
                var languages = advisorData.languages;
                if(languages.length >0){
                    for(let j= 0; j< languages.length; j++){
                        var languageName = languages[j];
                        await GetLanguage.findOne({name:languageName},async(err,languageData)=>{
                            if (err) {
                                return res.status(400).json({
                                    status: false,
                                    message: "Advisor Not Found"
                                });
                            }
                            else{
                                console.log("languageData",languageData);
                                if(languageData !== null){
                                    let languageimage = languageData.image;
                                    let languageName = languageData.name;
                                    langIcons.push({
                                        image:languageimage,
                                        name:languageName
                                    });
                                }
                                
                            }
                        });
                    }
                }
                setTimeout(()=>{
                    return res.json({
                        "status": 1,
                        "message": "Get data Successfully.",
                        "data": {
                            "id":advisorData._id,
                            "name":advisorData.firstName+" "+advisorData.lastName,
                            "advisorType":advisorData.advisorType,
                            "description":advisorData.description,
                            "image":advisorData.profilePic,
                            "isOnline":advisorData.isOnline,
                            "rating":advisorData.rating,
                            "languages":langIcons,
                            "specialities":specialityArr
                        }
                    });
                },3000);
            }
        });
    }      
}