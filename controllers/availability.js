const Getavailability = require("../models/availability");
const getBookCallModel = require("../models/bookCall");
const AddMoreInfo = require("../models/addMoreInfo");
const GetLanguage = require("../models/language");
const moment = require('moment');
const jwt = require("jsonwebtoken");
exports.addAvailability = (req, res) => {
    const dataAvailable = new Getavailability(req.body);
    var userId;
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
                console.log("userId",user.data._id);
                userId = user.data._id;
            }
        });
    }
    dataAvailable.set("advisorId",userId);
    dataAvailable.save((err, data) => {
        if (err) {
          return res.status(400).json({
            error: "NOT able to save introData in DB"
          });
        }
        res.json({ data });
    });
};  

exports.getAvailability = (req, res)=>{
    const data = (req.body);
    const advisorId = data.advisorId;
    Getavailability.find({advisorId:advisorId},(err, data) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: "NO Data found"
            });
        }
        else{
          const reformattedData = data && data.map((item, index) => ({
            id : index+1,
            regularDay : item.regularDay,
            specialDay : item.specialDay
          }));
            return res.json({
                "status": 1,
                "message": "Time listed Successfully.",
                "data":{
                    reformattedData
                }
            });
        }
    });
};

exports.getAvailableTimeSlot = (req, res)=>{
    const data =req.body;
    const date = data.date;
    const advisorId = data.advisorId;
    var specialDayDataFind="";
    var bookCallTimeSlot=[];
    var filnalArrSlot= [];
    var slotTimingArr =[];
    getBookCallModel.find({caseDate:date,advisorId:advisorId},(err,bookCallData)=>{
        if (err) {
            return res.status(400).json({
            error: "NO Data found"
          });
        }
        else{
            if(bookCallData == null || bookCallData == ""){
                console.log("No Call Book.")
            }
            else{
                for(let a =0; a<bookCallData.length;a++){
                    var slotArr = bookCallData[a].slots;
                    if(slotArr.length>0){
                        for(let b =0; b<slotArr.length; b++){
                            bookCallTimeSlot.push({
                                "startTime":slotArr[b].startTime,
                                "endTime":slotArr[b].endTime
                            });
                        }
                    }
                }
                // var unique = Array.from(new Set(bookCallTimeSlot));
                console.log("slotArr",slotArr);
            }
        }
    });
    Getavailability.find({advisorId:advisorId},(err,availabilTime)=>{
        if (err) {
            console.log(err)
            return res.status(400).json({
            error: "NO Data found"
          });
        }
        else{
            // console.log("availabilTime",availabilTime);
            if(availabilTime == null || availabilTime == ""){
                return res.json({
                    status:1,
                    message:"Advisor Not available"});
            }
            else{
                // console.log(availabilTime.length);
                for(let i=0; i < availabilTime.length;i++){
                    var a = availabilTime[i].specialDay;
                    // console.log("AAAA",a);
                    var __FOUND = a.find(function(post, index) {
                        if(post.date == date){
                            // console.log("post",post);
                            specialDayDataFind=post;
                            return true;
                        }
                    });
                }     
                // console.log("_found",specialDayDataFind);     
                // var timingFind = specialDayDataFind.timing;
                if(specialDayDataFind == undefined || specialDayDataFind == "" || specialDayDataFind == null){
                    var findDate = date.split('-');
                    var setFullDate = new Date(findDate[0],findDate[1]-1,findDate[2]);
                    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var dateNameFind = days[setFullDate.getDay()];
                    // console.log("dateNameFind",dateNameFind);
                    var regularDayFind = availabilTime.regularDay;
                    for(let i=0; i < availabilTime.length;i++){
                        var a = availabilTime[i].regularDay;
                        // console.log("AAAA",a);
                        var __FOUND = a.find(function(post, index) {
                            if(post.title == dateNameFind){
                                // console.log(post.title, dateNameFind);
                                // console.log("post",post);
                                specialDayDataFind=post;
                                // console.log("specialDayDataFind",specialDayDataFind);
                                return true;
                            }
                        });
                        // console.log("__FOUND__FOUND__FOUND",__FOUND);
                    }  
                    // console.log("specialDayDataFind",specialDayDataFind);   
                }
                var timingFind = specialDayDataFind.timing;
                if(timingFind.length < 1){
                    return res.json({
                        status:1,
                        message:"Advisor Not available"})
                }
                for(let j=0; j < timingFind.length; j++){
                    let x = {
                        slotInterval: 30,
                        openTime: timingFind[j].startTime,
                        closeTime: timingFind[j].endTime
                    };
                    let convertedStartTime = moment(x.openTime, 'hh:mm A');
                    let convertedEndTime = moment(x.closeTime, 'hh:mm A').add(0, 'days');
                    // console.log(convertedStartTime);
                    // console.log(convertedEndTime);
                    //Format the time
                    let startTime = moment(x.openTime, "HH:mm");
                    //Format the end time and the next day to it 
                    let endTime = moment(x.closeTime, "HH:mm").add(0, 'days');

                    // console.log(startTime);
                    // console.log(endTime);

                    //Loop over the times - only pushes time with 30 minutes interval
                    while (convertedStartTime <= convertedEndTime) {
                        // console.log("convertedStartTime",convertedStartTime);
                        //Push times
                        slotTimingArr.push(convertedStartTime.format("HH:mm")); 
                        //Add interval of 30 minutes
                        convertedStartTime.add(x.slotInterval, 'minutes');
                    }
                }
                
                slotTimingArr = Array.from(new Set(slotTimingArr));
                // console.log("slotTimingArr",slotTimingArr);
                for(let k = 0; k < slotTimingArr.length-1; k++){
                    var ampmstartTime = slotTimingArr[k].split(":")[0] >= 12 ? 'PM' : 'AM';
                    var ampmendTime = slotTimingArr[k+1].split(":")[0] >= 12 ? 'PM' : 'AM';
                    var firstTime = slotTimingArr[k].split(":");
                    var secondTime = slotTimingArr[k+1].split(":");
                    if(firstTime[0] > 12){
                        var startTimeFor24 = (firstTime[0]%12);
                        startTimeFor24 = startTimeFor24+":"+firstTime[1]
                        // console.log(startTimeFor24);
                    }
                    else{
                        var startTimeFor24 = slotTimingArr[k];
                    }

                    if(secondTime[0] > 12){
                        var endTimeFor24 = (secondTime[0]%12);
                        endTimeFor24 = endTimeFor24+":"+secondTime[1]
                        // console.log(endTimeFor24);
                    }
                    else{
                        var endTimeFor24 = slotTimingArr[k+1];
                    }
                        
                    filnalArrSlot.push({
                        "startTime":startTimeFor24+" "+ampmstartTime,
                        "endTime":endTimeFor24+" "+ampmendTime
                    });
                }
                // console.log("filnalArrSlot",filnalArrSlot);
                // console.log("bookCallTimeSlot",bookCallTimeSlot);
                var newArr =[]
                if(bookCallTimeSlot.length>0){
                    for(let c =0; c < filnalArrSlot.length; c++){
                        for(let d =0; d < bookCallTimeSlot.length; d++){
                            console.log("filnalArrSlotCHECK"+" "+c,filnalArrSlot[c]);
                            console.log("bookCallTimeSlotCHECK"+" "+d,bookCallTimeSlot[d]);
                            if(JSON.stringify(filnalArrSlot[c]) == JSON.stringify(bookCallTimeSlot[d])){
                                // console.log(c,d);
                                // resultARR.push(filnalArrSlot[c]);
                                // filnalArrSlot.splice(c,1);
                                console.log("cqwertyu",c);
                                filnalArrSlot[c].is_available = 0;
                            }
                            else{
                                console.log("c",c)
                                // filnalArrSlot[c].is_available = 1;
                            }
                        }
                    }
                }

                for(let p =0; p < filnalArrSlot.length; p++){
                    if(filnalArrSlot[p].is_available !== 0){
                        // console.log(filnalArrSlot[p].is_available,"filnalArrSlot[p].is_available")
                        filnalArrSlot[p].is_available = 1;
                    }
                }
                
                return res.json({
                    "status": 1,
                    "message": "Get data Successfully.",
                    "data": {
                        "list":filnalArrSlot
                    }
                });
            }
        }
    });
};

exports.getUpcommingAppointmentAdvisor = async(req, res)=>{
    var tokenDataForId;
    var image;
    var advisorName;
    var upcomingAppointment =[];
    // var accessToken = req.headers['cookie'];
    // var token = accessToken && accessToken.split('token=')[1];
    var accessToken = req.headers.authorization;
    console.log("accessToken",accessToken);
    var token = accessToken && accessToken.split(' ')[1];
    if (token == null){
        console.log("1122");
        return res.sendStatus(401)
    }        
    else{
        console.log("token",token)
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            else{
                tokenDataForId = user.data._id;
            }
        });
        console.log("tokenDataForId",tokenDataForId);
        await getBookCallModel.find({advisorId:tokenDataForId},async(err,bookCallData)=>{
            if (err) {
                console.log(err)
                return res.status(400).json({
                error: "NO Data found"
              });
            }
            else{
                // return res.json(bookCallData);
                if(bookCallData.length>0){
                    await AddMoreInfo.findById({_id:tokenDataForId},async(err,advisorData)=>{
                        if (err) {
                            console.log(err)
                            return res.status(400).json({
                            error: "NO Data found"
                        });
                        }
                        else{
                            advisorName = advisorData.firstName+" "+advisorData.lastName;
                            image = advisorData.profilePic;
                            console.log("advisorName",advisorName);
                            console.log("image",image);
                            if(bookCallData.length>0){
                                for(let i =0;i<bookCallData.length;i++){
                                    var date = bookCallData[i].caseDate;
                                    date = new Date("'"+date+"'");
                                    console.log("date",date);
                                    if(date < new Date().setHours(0,0,0,0)){
                                        // return res.json("No Data Found");
                                        console.log(i+99, new Date())
                                    }
                                    else{
                                        var language = bookCallData[i].languageId;
                                        await GetLanguage.findById(language,async(err,langugaeDetails)=>{
                                            if(err){
                                                language = "English"
                                            }
                                            else{
                                                
                                                if(langugaeDetails == null){
                                                    language = "English"
                                                }
                                                else{
                                                    language = langugaeDetails.name;
                                                }
                                            }
                                            var slots = bookCallData[i].slots;
                                            if(slots.length>0){
                                                for(let j=0;j<slots.length;j++){
                                                    startTime = slots[j].startTime;
                                                    endTime = slots[j].endTime;
                                                    var startTimeForDiff = moment.utc(startTime, "hh:mm");
                                                    var endTimeForDiff = moment.utc(endTime, "hh:mm");
                                                    console.log("startTimeForDifff", startTimeForDiff);
                                                    console.log("endTimeForDiff", endTimeForDiff);
                                                    var d = moment.duration(endTimeForDiff.diff(startTimeForDiff));
                                                    var totalTime = moment.utc(+d).format('H:mm'); 
                                                    console.log("totalTime", totalTime);
                                                    upcomingAppointment.push({
                                                        "date":date.toDateString(),
                                                        "time":startTime+" - "+endTime+" ("+totalTime+")",
                                                        "name":advisorName,
                                                        "language":language,
                                                        "image":image,
                                                        "id":bookCallData[i]._id
                                                    });
                                                }
                                                console.log("upcomingAppointment111",upcomingAppointment);
                                            }
                                            else{
                                                return res.json({
                                                    "status": 1,
                                                    "message": "Upcoming Appointment not found"
                                                })
                                            }
                                        });
                                    }                                
                                }
                                console.log("upcomingAppointment",upcomingAppointment);
                                setTimeout(()=>{
                                if(upcomingAppointment.length>0){
                                    
                                        return res.json({
                                            "status": 1,
                                            "message": "Get data Successfully.",
                                            "data":{
                                                upcomingAppointment
                                            }
                                        });
                                    
                                }
                                else{
                                    return res.json("Upcoming Appointment not found");
                                }
                                },1000); 
                            }
                            else{
                                
                            }
                        }
                    });                             
                }
                else{
                    return res.json("Data Not Found");
                }
            }
        });
    }
}

exports.listMyAdvisors = async(req, res)=>{
    var tokenDataForId;
    var advisorId;
    var list=[];
    var advisorList =[];
    var totalRecords =0;
    var accessToken = req.headers.authorization;
    console.log("accessToken",accessToken);
    var token = accessToken && accessToken.split(' ')[1];
    if (token == null){
        console.log("1122");
        return res.sendStatus(401)
    }        
    else{
        console.log("token",token)
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            else{
                tokenDataForId = user.data._id;
                getBookCallModel.find({userId:tokenDataForId},async(err,bookCallData)=>{
                    if (err) {
                        console.log(err)
                        return res.status(400).json({
                        error: "NO Data found"
                      });
                    }
                    else{
                        // return res.json(bookCallData);
                        if(bookCallData.length > 0){
                            console.log("bookCallData.length",bookCallData.length);
                            for(let i = 0; i<bookCallData.length; i++){
                                advisorId = bookCallData[i].advisorId;
                                advisorList.push(bookCallData[i].advisorId);
                            }
                            advisorList = [...new Set(advisorList)];
                            console.log("advisorList",advisorList);
                            AddMoreInfo.aggregate([{
                                $lookup:{
                                    from: "getBookCallModel",
                                    localField:"_id",
                                    foreignField:"advisorId",
                                    as:"newArray"
                                },   
                            },
                            {
                                $match: {
                                    "newArray._id": { $nin: advisorList },
                                },
                            }
                            ],(err,data12)=>{
                                console.log(err,"err","data1",data12);
                            });
                            for(let j = 0; j< advisorList.length; j++){
                                // totalRecords = advisorList.length;
                                advisorId = advisorList[j];
                                await AddMoreInfo.findById(advisorId,async(err,advisorData)=>{
                                    if (err) {
                                        console.log(err)
                                        return res.status(400).json({
                                        error: "NO Data found"
                                      });
                                    }
                                    else{  
                                        console.log(j," advisorData",advisorData); 
                                        if(advisorData == null || advisorData == undefined || advisorData == ""){
                                            console.log("data not found")
                                        }
                                        else{
                                            totalRecords += 1
                                            list.push({
                                                id:advisorData._id,
                                                name:advisorData.firstName+" "+advisorData.lastName,
                                                image:advisorData.profilePic,
                                                isOnline:advisorData.isOnline,
                                                rating:advisorData.rating,
                                            });
                                        }
                                    }
                                });
                            }
                            setTimeout(()=>{
                                return res.json({
                                    "status": 1,
                                    "message": "Get data Successfully.",
                                    "data": {
                                        "totalRecords":totalRecords,
                                        "list":list
                                    }
                                });   
                            },1000);
                        }
                        else{
                            return res.json({
                                "status": 1,
                                "message": "Get data Successfully.",
                                "data": {
                                    "totalRecords":0,
                                    "list":[]
                                }
                            });   
                        }
                    }
                });
            }
        });
    }
};