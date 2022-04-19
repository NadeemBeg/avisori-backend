
const Getmessage = require("../models/message");
const AddMoreInfo = require("../models/addMoreInfo");
const jwt = require("jsonwebtoken");
exports.addMessage = (req, res) => {
    const messageData = new Getmessage(req.body);
    console.log("messageData",messageData);

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

    const subject = messageData.subject;

    if(subject == "" || subject == null){
        return res.json("Please Enter Subject");
    }
    messageData.set('senderId',userId);
    console.log("messageData",messageData);
    messageData.save((err,message)=>{
        if(err){
            return res.status(400).json({
                error: "Message not add."
            });
        }
        else{
            var date = message.createdAt;
            var setDate = date.toDateString().slice(4);

            res.json({
                "status": 1,
                "message": "Add data Successfully.",
                "data":{
                    "id":message._id,
                    "userId" : message.userId,
                    "subject": message.subject,
                    "description": message.description,
                    "createdAt": setDate
                },
            })
        }
    })
}

exports.messageList = async(req, res) => {
    var messageCollection = [];
    // const messageData = new Getmessage(req.body);
    // console.log("messageData",messageData);
    
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

    await Getmessage.find({senderId:userId,isDelete:false}).exec(async(err, data) => {
        if (err) {
            return res.status(400).json({
                status:false,
                message: "NO Record found"
            });
        }
        else{
            if(data == null || data == ""){
                res.json({
                    "status": 1,
                    "message": "list messsages Successfully.",
                    "data":{
                        "list":[]
                    }
                });
            }
            else{
                console.log("data",data);
                for (let a = 0; a < data.length; a++) {
                    var id = data[a].userId;
                    var date = data[a].createdAt;
                    var setDate = date.toDateString().slice(4);
                    await AddMoreInfo.findOne({_id:id},async(err,data1)=>{
                        if (err) {
                            return res.status(400).json({
                            error: "NO Data found"
                            });
                        }
                        else{
                            if(data1 !== null){
                                messageCollection.push({
                                    "id":data[a]._id,
                                    "userId":data1._id,
                                    "image":data1.profilePic,
                                    "name":data1.firstName+" "+ data1.lastName,
                                    "subject":data[a].subject,
                                    "description":data[a].description,
                                    "createdAt":setDate
                                });
                            }
                            else{
                                console.log("This user not found in db");
                            }
                        }
                    });
                } 
                setTimeout(() =>{
                    res.json({
                        "status": 1,
                        "message": "list messsages Successfully.",
                        "data":{
                            "list":messageCollection
                        }
                    });
                },100); 
            }
        }
    });
};
exports.deleteMsg = (req, res) => {
    var {messageId} = req.body;
    console.log("messageId",messageId);
    if(messageId == null || messageId == "" || messageId == undefined){
        return res.status(400).json({
            "status": false,"message":"Message not found."
        });
    }
    else{
        Getmessage.findOne({_id:messageId},(err,messageDetails)=>{
            if(err){
                return res.status(400).json({
                    "status": false,"message":"Message not found."
                });
            }
            else{
                console.log("messageDetails",messageDetails);
                if(messageDetails == null){
                    return res.json({
                        "status": false,"message":"Message not found."
                    });
                }
                else{
                   if(messageDetails.isDelete == true){
                        return res.json({
                            "status": 1,"message":"Message Already Deleted."
                        });
                    }
                    else{
                        Getmessage.findOneAndUpdate(
                            {_id:messageId}, 
                            { $set: { isDelete: true } },
                            (err,data)=>{
                            if(err){
                                return res.status(400).json({
                                    "status": false,"message":"Message not found."
                                });
                            }
                            else{
                                res.json({
                                    "status": 1,
                                    "message": "Data deleted Successfully.",
                                })
                            }
                        });
                    }
                }
            }
        });
    }
};

exports.replyMessage = (req, res) => {
    const msgData = new Getmessage(req.body);

    var senderId;
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
                console.log("senderId",user.data._id);
                senderId = user.data._id;
            }
        });
    }
    const subject = msgData.subject;
    const messageId = msgData.messageId;
    const userId = msgData.userId;
    if(messageId ==null || messageId == ""){
        return res.status(400).json({
            "status": false,
            "message": "Please Enter MessageId."
        });
    }
    if(subject ==null || subject == ""){
        return res.status(400).json({
            "status": false,
            "message": "Please Enter subject."
        });
    }
    if(userId ==null || userId == ""){
        return res.status(400).json({
            "status": false,
            "message": "Please Enter userId."
        });
    }
    else{
        msgData.set('senderId',senderId);
        msgData.save((err,message)=>{
            if(err){
                return res.status(400).json({
                    "status": false,
                    "message": "Message not send."
                });
            }
            else{
                var date = message.createdAt;
                var setDate = date.toDateString().slice(4);
                res.json({
                    "status": 1,
                    "message": "messages replied Successfully.",
                    "data":{
                        "id": message._id,
                        "userId":message.userId,
                        "messageId":message.message,
                        "subject":message.subject,
                        "description":message.description,
                        "createdAt":setDate
                    }
                });
            }
        });
    }
}