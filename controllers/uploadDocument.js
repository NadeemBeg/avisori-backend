const getUploadDocument = require("../models/uploadDocument");
const getBookCallModel = require("../models/bookCall");
var multer  = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("req.bodyreq.bodyreq.body1222222",req.body.orderId);
        cb(null, "./uploads/documents");
    },
    filename: (req, file, cb) => {
        console.log("req.bodyreq.bodyreq.body12",req.body.orderId);
        var orderId = req.body.orderId;
        if(orderId !== null){
            getBookCallModel.findOne({_id:orderId},(err,bookcallData)=>{
                console.log("bookcallData",bookcallData);
                if (err) {
                    cb("Some error like 400");
                }
                else{
                    if(bookcallData !== null && bookcallData !== "" && bookcallData !== undefined){
                        console.log("1");
                        var extensionsGet = file.originalname;
                        extensionsGet = extensionsGet.split('.');
                        extensionsGet = extensionsGet[1];
                        if(extensionsGet === "pdf"){
                            if(file){
                                cb(null, (new Date()).getTime()+file.originalname);//png
                            }
                        }
                        else{
                            cb({
                                status:1,
                                message:file.originalname+" file not Pdf. Only PDF can be upload"
                            });
                        }
                    }
                    else{
                        cb({
                            status:1,
                            message:"Book Call not found"
                        });
                    }
                }

            });
        }
    }
});

const upload = multer({storage: storage}).any('uploadDocument');

exports.uploadDocument = (req,res)=>{
    var finalDocumentArr = [];
    upload(req,res,err => {
        console.log("req.bodyreq.bodyreq.body",req.body.orderId);
        if(err){
            return res.json(err);
        }
        else{
            var orderId = req.body.orderId;
            var files = req.files;
            console.log("files",files);
            if(files.length > 0){
                for(let i =0; i<files.length; i++){
                    finalDocumentArr.push({
                        originalname:files[i].originalname,
                        filename:files[i].filename,
                        path:files[i].path
                    });
                }
                console.log("finalDocumentArr",finalDocumentArr);
                getUploadDocument.insertMany({orderId: orderId, documents: finalDocumentArr},(err,uploadData)=>{
                    if(err){
                        return res.status(400).json({
                            error: "Some error like 404"
                        });
                    }
                    else{
                        return res.json({"status": 1,
                        "message": "Documents uploaded Successfully."});
                    }
                });
            }
            else{
                return res.json("File not Found");
            }
            
        }
    });
    // console.log("req.bodyreq.bodyreq.body",req.body);
};