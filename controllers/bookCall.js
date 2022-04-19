const getBookCallModel = require("../models/bookCall");
const AddMoreInfo = require("../models/addMoreInfo");
const GetcompanyData = require("../models/company");
const getUploadDocument = require("../models/uploadDocument");
const getaddFeedback = require("../models/addFeedback");
const getCategory = require("../models/category");
const getLanguage = require("../models/language");
const jwt = require("jsonwebtoken");
const moment = require('moment');
var mongoose = require('mongoose');
exports.addBookCall = (req, res) => {
    console.log("doen");
    const data = new getBookCallModel(req.body);
    const categoryId = data.categoryId;
    const subCategoryId = data.subCategoryId;
    const languageId = data.languageId;
    var userId;
    var accessToken = req.headers.authorization;
    console.log("accessToken",accessToken);
    var token = accessToken && accessToken.split(' ')[1];
    if (token == null) 
        return res.sendStatus(401)
    else{
        console.log("token",token)
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) return res.sendStatus({status:false,message:"login user Id not found"})
            else{
                console.log("userId",user.data._id);
                userId = user.data._id;
            }
        });
    }
    if(categoryId == "" || categoryId == null){
        return res.json("Please Enter Category !");
    }
    if(subCategoryId == "" || subCategoryId == null){
        return res.json("Please Enter subCategory !");
    }
    if(languageId == "" || languageId == null){
        return res.json("Please Enter language !");
    }
    data.set("userId",userId);
    data.save((err,bookcall)=>{
        if (err) {
            console.log("bookcall",bookcall);
            console.log("err",err);
            return res.status(400).json({
              error: "Some error like 402"
            });
        }
        else{
            console.log("bookcall",bookcall);
            getBookCallModel.find().exec((err,calls)=>{
                if (err) {
                    
                    return res.status(400).json({
                      error: "Some error like 400"
                    });
                }
                else{
                    const id = bookcall._id;
                    var count = calls.length;
                    console.log("count",count);
                    getBookCallModel.findOneAndUpdate({ _id: id },{ $set: {caseNumber: count} },(err, BookNumberUpdate) => {
                        if (err) {
                            return res.status(400).json({
                              error: "Some error like 400"
                            });
                        }
                        else{
                            var advisorName;
                            var id = BookNumberUpdate.advisorId;
                            AddMoreInfo.findById(id,(err,advisorData)=>{
                                if(err){
                                    console.log("test");
                                    advisorName = null
                                }
                                else{
                                    if(advisorData == null){
                                        advisorName = null
                                        console.log("test");
                                    }
                                    else{
                                        advisorName = advisorData.firstName+' '+advisorData.lastName
                                    }
                                }
                            });
                            setTimeout(()=>{
                                return res.json({
                                    "status": 1,
                                    "message": "Call booked Successfully.",
                                    "data":{
                                       "orderId":BookNumberUpdate._id,
                                        "advisorId":BookNumberUpdate.advisorId,
                                        "advisorName":advisorName,
                                        "caseDate":BookNumberUpdate.caseDate,
                                        "caseTime":BookNumberUpdate.caseTime,
                                        "createdAt":BookNumberUpdate.createdAt 
                                    }
                                });
                            },3000);
                        }
                    })
                }
            });
        }
    });
};
exports.myCases = async(req, res) => {
    var callList =[];
    var userId;

    // var accessToken = req.headers['cookie'];
    // var token = accessToken && accessToken.split('token=')[1];
    var accessToken = req.headers.authorization;
    // console.log("accessToken",accessToken);
    var token = accessToken && accessToken.split(' ')[1];
    if (token == null) 
        return res.sendStatus(401)
    else{
        console.log("token",token)
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                return res.sendStatus("Login user Id not found");
            }
            else{
                userId = user.data._id;
            }
        });
    }
    if(userId == null || userId == ""){
        return res.json("Please send User ID");
    }
    await getBookCallModel.find({userId:userId},async(err,findcase)=>{
        if (err) {
            return res.status(400).json({
              error: "Some error like 400"
            });
        }
        else{
            // console.log("findcase",findcase)
            if(findcase.length > 0){
                for(let i = 0; i < findcase.length; i++){
                    var advisorId = findcase[i].advisorId;
                    await AddMoreInfo.findOne({ _id:advisorId }, async(err, user1) => {
                        if (err) {
                            return res.status(400).json({
                              error: "USER does not exists"
                            });
                        }
                        else{
                            if(user1 == null){
                                console.log("User null")
                            }
                            else{
                                // console.log(i,"user1",user1);
                                var caseDate = findcase[i].caseDate;
                                // var splitTimeDate = caseDateTime.split(" ");
                                // var caseDate = splitTimeDate[0];
                                var setDate = new Date(caseDate).toDateString().slice(4);
                                var caseTime = findcase[i].caseTime;
                                var ampm = caseTime.split(":")[0] >= 12 ? 'pm' : 'am';
                                var caseNumber = findcase[i].caseNumber;
                                // console.log("setDate", setDate);
                                callList.push({
                                    id:findcase[i]._id,
                                    advisorName: user1.firstName+ " "+ user1.lastName,
                                    // caseDate:setDate+" at "+caseTime+" "+ampm ,
                                    caseDate:setDate+" at "+caseTime ,
                                    caseNumber:"#"+caseNumber
                                });
                            }
                        }
                    });
                }
                setTimeout(()=>{
                    return res.json({
                        "status": 1,
                        "message": "list cases Successfully.",
                        "data": {
                                "list":callList
                        }
                    });
                },100)
            }
            else{
                return res.json({
                    "status": 1,
                    "message": "list cases Successfully.",
                    "data": {
                            "list":[]
                    }
                });
            }
        }
    });
};
exports.viewCase= async(req, res) => {
    const data = req.body;
    const id= data.orderId;
    var supplierName;
    var callDetails =[];
    if(id == null || id == undefined || id ==""){
        return res.json("Call not start");
    }
    await getBookCallModel.findById({_id:id},async(err,findBookCallData)=>{
        if (err) {
            return res.status(400).json({
                error: "Book call not aviable"
            });
        }
        else{
            console.log("findBookCallData",findBookCallData);
            if(findBookCallData !== null){
                var findSlot = findBookCallData.slots;
                if(findSlot.length>0){
                    var findLanguage = findBookCallData.languageId;
                    var findDate = findBookCallData.caseDate;
                    var setDate = new Date(findDate).toDateString().slice(4);
                    var subCategoryId = findBookCallData.subCategoryId;
                    var caseNumber = findBookCallData.caseNumber;
                    var findadviceSeekerName =findBookCallData.userId;
                    var findAdvisor = findBookCallData.advisorId;
                    var findTime = findBookCallData.caseTime;
                    var ampm = findTime.split(":")[0] >= 12 ? 'PM' : 'AM';
                    var startDateTime = findBookCallData.slots[0].startTime;
                    var endDateTime = findBookCallData.slots[0].endTime;
                    var start = moment.utc(startDateTime, "HH:mm");
                    var end = moment.utc(endDateTime, "HH:mm");
                    await getCategory.findById(subCategoryId,async(err, subCategoryData)=>{
                        console.log("1")
                        if(err){
                            console.log(err);
                            subCategoryId = null;
                        }
                        else{
                            if(subCategoryData == null){
                                subCategoryId = null;
                            }
                            else{
                                console.log("2",subCategoryData.title)
                                subCategoryId = subCategoryData.title;
                            }
                        }
                    });
                    console.log("findLanguage",findLanguage);
                    if( !mongoose.Types.ObjectId.isValid(findLanguage) )
                    {
                        findLanguage = null;
                    }
                    else{
                        await getLanguage.findOne({_id:findLanguage},async(err, findLanguageData)=>{
                        console.log("3",findLanguageData,"err",err)
                        if(err){
                            console.log("123654");
                            findLanguage = null;
                        }
                        else{
                            if(findLanguageData == null || findLanguageData == undefined){
                                findLanguage = null;
                            }
                            else{
                                console.log("4",findLanguageData.name)
                                findLanguage = findLanguageData.name;
                            }
                        }
                        });
                    }
                    
                    // console.log("start",start,"end",end);
                    for(let i = 0; i< findSlot.length;i++){
                        var startDateTime = findBookCallData.slots[i].startTime;
                        var endDateTime = findBookCallData.slots[i].endTime;
                        var start = moment.utc(startDateTime, "HH:mm");
                        var end = moment.utc(endDateTime, "HH:mm");
                        var d = moment.duration(end.diff(start));
                        var totalTime = moment.utc(+d).format('H:mm');  
                        var hours = totalTime.split(":")[0];
                        if(hours>12){
                            hours=hours-12;
                        }
                        totalTime = hours+":"+totalTime.split(":")[1];
                        console.log("totalTime",totalTime);
                        var cost = hours*10;
                        if(totalTime.split(":")[1] >= 1){
                            cost = cost+5;
                        }
                        callDetails.push({
                            id:i+1,
                            callDateTime:setDate+" at "+findTime+" "+ampm,
                            timeSpentMinute:totalTime.split(":")[1]+ "Min",
                            totalCharge:"$"+cost+".00",
                            timeSpent:totalTime,
                            startDateTime:setDate+" at "+startDateTime,
                            endDateTime:setDate+" at "+endDateTime,
                            cost: "$"+cost+".00",
                            vat: "$0.50"
                        });
                    }
    
                    await AddMoreInfo.findOne({_id:findAdvisor},async(err,advisorData)=>{
                        if (err) {
                            return res.status(400).json({
                            error: "Book call not aviable"
                            });
                        }
                        else{
                            // console.log("advisorData",advisorData);
                            findAdvisor = advisorData.firstName+" "+advisorData.lastName;
                            supplierName = advisorData.companyId;
                            if(supplierName == null || supplierName == "" || supplierName == undefined){
                                supplierName = null;
                            }
                            else{
                                await GetcompanyData.findOne({_id:supplierName},async(err,companyData)=>{
                                    if (err) {
                                        return res.status(400).json({
                                        error: "Book call not aviable"
                                        });
                                    }
                                    else{
                                        supplierName = companyData.title;
                                    }
                                });
                            }
                            // console.log("advisorData",findAdvisor);
                        }
                    });
                    await AddMoreInfo.findOne({_id:findadviceSeekerName},async(err,adviceSeekerData)=>{
                        if (err) {
                            return res.status(400).json({
                            error: "Book call not aviable"
                            });
                        }
                        else{
                            findadviceSeekerName = adviceSeekerData.firstName+" "+adviceSeekerData.lastName;
                            // console.log("advisorData",findadviceSeekerName);
                        }
                    });
                    let uploadedDocumentCount = 0;
                    await getUploadDocument.find({orderId:id},async(err,uploadedDocument)=>{
                        if (err) {
                            return res.status(400).json({
                            error: "Book call not aviable"
                            });
                        }
                        else{
                            
                            if(uploadedDocument.length >0){
                                for(let i =0; i<uploadedDocument.length; i++){
                                    var documents = uploadedDocument[i].documents;
                                    if(documents.length>0){
                                        uploadedDocumentCount = uploadedDocumentCount+documents.length;
                                    }
                                }
                            }
                            else{
                                uploadedDocumentCount = 0;
                            }
                        }
                    });
                    setTimeout(()=>{
                        
                        return res.json({
                            "status": 1,
                            "message": "Data get Successfully.",
                            "data":{
                                "id":1,
                                "bookcallId":id,
                                "advisorName":findAdvisor,
                                // "caseDate":setDate+" at "+findTime+" "+ampm,
                                "caseDate":setDate+" at "+findTime,
                                "caseNumber":"#"+caseNumber,
                                "subCategory":subCategoryId,
                                "language":findLanguage,
                                "supplierName":supplierName,
                                "adviceSeekerName":findadviceSeekerName,
                                "uploadedDocumentCount":uploadedDocumentCount,
                                "callDetails":callDetails,
                            },
                        });
                    },1000);
                }
                else{
                    return res.json("Time not found");
                } 
            }
            else{
                return res.json("Time not found");
            }
            
        }
    });
};

exports.startCall= (req, res) => {
    const data = req.body;
    const id = data.orderId;
    var startTimereq = data.startTime;
    var slots=[];
    var firstSlotStartTime;
    var SecondSlotStartTime;
    var findStartTime;
    if(id == null || id == undefined || id ==""){
        return res.json("Call not start");
    }
    if(startTimereq == null || startTimereq == undefined || startTimereq ==""){
        return res.json("Start time not define");
    }
    else{
        startTimereq =moment.utc(startTimereq,"HH:mma");
    }
    getBookCallModel.findById({_id:id},(err,bookcallData)=>{
        if (err) {
            return res.status(400).json({
              error: "Book call not aviable"
            });
        }
        else{
            var findSlot = bookcallData.slots;
            if(findSlot.length>0){
                for(let i=0; i<findSlot.length;i++){
                    if(findSlot[0].startTime){
                        firstSlotStartTime = findSlot[0].startTime;
                    }
                    if(findSlot[1].startTime){
                        SecondSlotStartTime = findSlot[1].startTime;
                    }
                }
                if(firstSlotStartTime !== null && firstSlotStartTime !== undefined && firstSlotStartTime !== ""){
                    firstSlotStartTime = moment.utc(firstSlotStartTime, "HH:mma");
                }
                if(SecondSlotStartTime !== null && SecondSlotStartTime !== undefined && SecondSlotStartTime !== ""){
                    SecondSlotStartTime = moment.utc(SecondSlotStartTime, "HH:mma");
                    if(firstSlotStartTime < SecondSlotStartTime){
                        console.log("1","firstSlotStartTime",firstSlotStartTime,"SecondSlotStartTime",SecondSlotStartTime);
                        findStartTime = firstSlotStartTime;
                    }
                    else{           
                        console.log("2");
                        findStartTime = SecondSlotStartTime;
                    }
                }
                else{
                    console.log("3");
                    findStartTime = firstSlotStartTime;
                }       
                if((startTimereq).isBefore(findStartTime)){
                    var d = moment.duration(findStartTime.diff(startTimereq));
                    var totalTime = moment.utc(+d).format('HH:mm');            
                    return res.status(200).json({
                        Message: "Time is due for your call to start "+totalTime
                      });
                }
                else{
                    getBookCallModel.updateOne({_id:id},{$set:{status:2}},(err,dataUpdate)=>{
                        if (err) {
                            return res.status(400).json({
                            error: "Book call not aviable"
                            });
                        }
                        else{
                            return res.json({
                                "status": 1,
                                "message": "Call started Successfully."
                            });
                        }
                    });
                }
            }
            else{
                return res.json("Time not found")
            }
        }
    });
};
exports.endCall = (req, res) => {
    const data = req.body;
    const id = data.orderId;
    var endTimereq = data.endTime;
    // var slots=[];
    var supplierName;
    var firstSlotEndTime, firstSlotStartTime, showSlotFirstStartTime ,showSlotFirstEndTime;
    var secondSlotEndTime, SecondSlotStartTime, showSlotSecondStartTime ,showSlotSecondEndTime;
    var findEndTime, findStartTime, finalShowStartTime, finalShowEndTime;
    var extraTimeCallMin;
    if(id == null || id == undefined || id ==""){
        return res.json("Call not start");
    }
    if(endTimereq == null || endTimereq == undefined || endTimereq ==""){
        return res.json("Start time not define");
    }
    else{
        endTimereq =moment.utc(endTimereq,"HH:mma");
    }
    getBookCallModel.findById({_id:id},(err,bookcallData)=>{
        if (err) {
            return res.status(400).json({
              error: "Book call not aviable"
            });
        }
        else{
            var findSlot = bookcallData.slots;
            if(findSlot.length>0){
                for(let i=0; i<findSlot.length;i++){
                    if(findSlot[0].endTime){
                        firstSlotStartTime = findSlot[0].startTime;
                        showSlotFirstStartTime = findSlot[0].startTime;
                        showSlotFirstEndTime = findSlot[0].endTime;
                        firstSlotEndTime = findSlot[0].endTime;
                    }
                    if(findSlot[1].endTime){
                        SecondSlotStartTime = findSlot[1].startTime;
                        showSlotSecondStartTime = findSlot[1].startTime;
                        showSlotSecondEndTime = findSlot[1].endTime;
                        secondSlotEndTime = findSlot[1].endTime;
                    }
                }
                if(firstSlotEndTime !== null && firstSlotEndTime !== undefined && firstSlotEndTime !== ""){
                    firstSlotEndTime = moment.utc(firstSlotEndTime, "HH:mma");
                    firstSlotStartTime = moment.utc(firstSlotStartTime, "HH:mma");
                }
                if(secondSlotEndTime !== null && secondSlotEndTime !== undefined && secondSlotEndTime !== ""){
                    secondSlotEndTime = moment.utc(secondSlotEndTime, "HH:mma");
                    SecondSlotStartTime = moment.utc(SecondSlotStartTime, "HH:mma");
                    // End Time
                    if(firstSlotEndTime < secondSlotEndTime){
                        findEndTime = secondSlotEndTime;
                        finalShowEndTime = showSlotSecondEndTime;
                    }
                    else{         
                        findEndTime = firstSlotEndTime;
                        finalShowEndTime = showSlotFirstEndTime;
                    }
                    //start time
                    if(firstSlotStartTime < SecondSlotStartTime){
                        findStartTime = firstSlotStartTime;
                        finalShowStartTime = showSlotFirstStartTime;
                    }

                    else{           
                        findStartTime = SecondSlotStartTime;
                        finalShowStartTime = showSlotSecondStartTime
                    }

                }
                else{ 
                    findEndTime = firstSlotEndTime;
                    findStartTime = firstSlotStartTime;
                    finalShowStartTime = showSlotFirstStartTime;
                    finalShowEndTime = showSlotFirstEndTime;

                }  
                console.log("findEndTime",findEndTime,"endTimereq",endTimereq,"secondSlotEndTime",secondSlotEndTime);
                console.log((findEndTime).isAfter(endTimereq));      
                if((endTimereq).isAfter(findEndTime)){
                    var d = moment.duration(endTimereq.diff(findEndTime));
                    extraTimeCallMin = moment.utc(+d).format('H:mm');            
                    // return res.status(200).json({
                    //     Message: "Time is due for your call to start "+extraTimeCallMin
                    //   });
                }
                else{
                    extraTimeCallMin = 0;
                }
                getBookCallModel.findOneAndUpdate({_id:id},{$set:{status:1}},(err,dataUpdate)=>{
                    if (err) {
                        return res.status(400).json({
                          error: "Book call not aviable"
                        });
                    }
                    else{
                        var subCategoryName = dataUpdate.subCategoryId;
                        var findLanguage = dataUpdate.languageId;
                        getCategory.findById(subCategoryName,(err, subCategoryData)=>{
                            console.log("1")
                            if(err){
                                console.log(err);
                                subCategoryName = null;
                            }
                            else{
                                if(subCategoryData == null){
                                    subCategoryName = null;
                                }
                                else{
                                    console.log("2",subCategoryData.title)
                                    subCategoryName = subCategoryData.title;
                                }
                            }
                        });
                        getLanguage.findById(findLanguage,(err, findLanguageData)=>{
                            console.log("3")
                            if(err){
                                console.log(err);
                                findLanguage = null;
                            }
                            else{
                                if(findLanguageData == null){
                                    findLanguage = null;
                                }
                                else{
                                    console.log("4",findLanguageData.name)
                                    findLanguage = findLanguageData.name;
                                }
                            }
                        });
                        var findDate = dataUpdate.caseDate;
                        var setDate = new Date(findDate).toDateString().slice(4);
                        var findTime = dataUpdate.caseTime;
                        var ampm = findTime.split(":")[0] >= 12 ? 'PM' : 'AM';
                        
                        var caseNumber = dataUpdate.caseNumber;
                        var findadviceSeekerName =dataUpdate.userId;
                        // var startDateTime = dataUpdate.slots[0].startTime;
                        // var endDateTime = dataUpdate.slots[0].endTime;
                        // var start = moment.utc(startDateTime, "HH:mm");
                        // var end = moment.utc(endDateTime, "HH:mm");
                        console.log("start",findStartTime,"end",findEndTime);
                        if (findEndTime.isBefore(findEndTime)){
                            console.log("end.isBefore(start)");
                            findEndTime.add(1, 'day');
                        }
                        var d = moment.duration(findEndTime.diff(findStartTime));
                        var totalTime = moment.utc(+d).format('H:mm');
                        console.log("start",totalTime);
                        var hours = totalTime.split(":")[0];
                        if(hours>12){
                            hours=hours-12;
                        }
                        totalTime = hours+":"+totalTime.split(":")[1];
                        console.log("totalTime",totalTime);
                        var cost = hours*10;
                        if(totalTime.split(":")[1] >= 1){
                            cost = cost+5;
                        }
                        AddMoreInfo.findOne({_id:findadviceSeekerName},(err,adviceSeekerData)=>{
                            if (err) {
                                return res.status(400).json({
                                error: "Book call not aviable"
                                });
                            }
                            else{
                                findadviceSeekerName = adviceSeekerData.firstName+" "+adviceSeekerData.lastName;
                                console.log("advisorData",findadviceSeekerName);
                            }
                        });
                        var findAdvisor = dataUpdate.advisorId;
                        AddMoreInfo.findOne({_id:findAdvisor},(err,advisorData)=>{
                            if (err) {
                                return res.status(400).json({
                                error: "Book call not aviable"
                                });
                            }
                            else{
                                console.log("advisorData",advisorData);
                                findAdvisor = advisorData.firstName+" "+advisorData.lastName;
                                supplierName = advisorData.companyId;
                                if(supplierName == null || supplierName == "" || supplierName == undefined){
                                    supplierName = null;
                                }
                                else{
                                    GetcompanyData.findOne({_id:supplierName},(err,companyData)=>{
                                        if (err) {
                                            return res.status(400).json({
                                            error: "Book call not aviable"
                                            });
                                        }
                                        else{
                                            supplierName = companyData.title;
                                        }
                                    });
                                }
                                console.log("advisorData",findAdvisor);
                            }
                        });
                        let uploadedDocumentCount = 0;
                        getUploadDocument.find({orderId:id},(err,uploadedDocument)=>{
                            if (err) {
                                return res.status(400).json({
                                error: "Book call not aviable"
                                });
                            }
                            else{
                                
                                if(uploadedDocument.length >0){
                                    console.log("1")
                                    for(let i =0; i<uploadedDocument.length; i++){
                                        console.log("2")
                                        var documents = uploadedDocument[i].documents;
                                        if(documents.length>0){
                                            console.log("3")
                                            uploadedDocumentCount = uploadedDocumentCount+documents.length;
                                            console.log("uploadedDocumentCount",uploadedDocumentCount,"documents.length",documents.length);
                                        }
                                    }
                                }
                                else{
                                    uploadedDocumentCount = 0;
                                }
                            }
                        });

                        setTimeout(()=>{
                            return res.json({
                                "status": 1,
                                "message": "Call end Successfully.",
                                "data":{
                                    "id":1,
                                    "advisorName":findAdvisor,
                                    "caseDate":setDate+" at "+findTime+" "+ampm,
                                    "caseNumber":"#"+caseNumber,
                                    "subCategory":subCategoryName,
                                    "language":findLanguage,
                                    "supplierName":supplierName,
                                    "adviceSeekerName":findadviceSeekerName,
                                    "uploadedDocumentCount":uploadedDocumentCount,
                                    "startDateTime": setDate+" at "+finalShowStartTime,
                                    "endDateTime": setDate+" at "+finalShowEndTime,
                                    "timeSpent": totalTime,
                                    "cost": "$"+cost+".00",
                                    "vat": "$0.50"
                                },
                            });
                        },5000);
                    }
                });
            }
            else{
                return res.json("Time not found")
            }
        }
    });
};
exports.addFeedback = (req, res) => {
    const data = req.body;
    const id = data.orderId;
    const comment = data.comment;
    const rating = data.rating;
    if(id == null || id == undefined || id ==""){
        return res.json("Call not start");
    }
    if(comment == null || comment == undefined || comment ==""){
        return res.json("Please Write your comment for advisor.");
    }
    getBookCallModel.findById({_id:id},(err,bookcallData)=>{
        if (err) {
            return res.status(400).json({
              error: "Book call not aviable"
            });
        }
        else{
            console.log("bookcallData",bookcallData);
            if(bookcallData !== undefined && bookcallData !== "" && bookcallData !== null){
                var advisorId = bookcallData.advisorId;
                var adviceSeekerId = bookcallData.userId;
                getaddFeedback.findOne({orderId:id},(err,feedbackdata)=>{
                    if (err) {
                        return res.status(400).json({
                          error: "Book call not aviable"
                        });
                    }
                    else{
                        console.log("feedbackdata",feedbackdata);
                        if(feedbackdata !== undefined && feedbackdata !== "" && feedbackdata !== null){
                            getaddFeedback.updateMany({orderId:id},{$set:{"comment":comment,"rating":rating}},(err,updateData)=>{
                                if (err) {
                                    return res.status(400).json({
                                      error: "Book call not aviable"
                                    });
                                }
                                else{
                                    return res.json({
                                        "status": 1,
                                        "message": "Feedback added Successfully."
                                    });
                                }
                            });
                        }
                        else{
                            getaddFeedback.insertMany({"orderId":id,"advisorId":advisorId,"adviceSeekerId":adviceSeekerId,"comment":comment,"rating":rating}, (err,saveData)=>{
                                if (err) {
                                    return res.status(400).json({
                                      error: "Book call not aviable"
                                    });
                                }
                                else{
                                    return res.json({
                                        "status": 1,
                                        "message": "Feedback added Successfully."
                                    });
                                }
                            });
                        }
                    }
                });
            }
            else{
                return res.json("Call data not found");
            }
        }
    });
}