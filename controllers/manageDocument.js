const getManageDocument = require("../models/manageDocument");
var multer  = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log("req.bodyreq.bodyreq.body1222222",req.body);
        cb(null, "./uploads/manageDocuments");
    },
    filename: (req, file, cb) => {
        // console.log("req.bodyreq.bodyreq.body12",req.body);
            console.log("1");
            var extensionsGet = file.originalname;
            console.log("extensionsGet",extensionsGet);
            extensionsGet = extensionsGet.split('.');
            extensionsGet = extensionsGet[1];
            if(extensionsGet === "pdf"){
                console.log("extensionsGet","1");
                if(file){
                    console.log("extensionsGet","2",file);
                    cb(null, file.originalname.replace(/ /g, ""));//png
                }
            }
            else{
                console.log("extensionsGet","3");
                cb({
                    status:1,
                    message:file.originalname+" file not Pdf. Only PDF can be upload"
                });
            }
    }
});

const upload = multer({storage: storage}).any('manageDocument');

exports.addDocument = (req,res)=>{
    var finalDocument = new getManageDocument();
    upload(req,res,err => {
        console.log("req.bodyreq.bodyreq.body",req.body);
        console.log("req.bodyreq.bodyreq.req",req.file);
        console.log("req.bodyreq.bodyreq.err",req.err);
        var id = req.body.id;
        var title = req.body.title;
        var type = req.body.type;
        var originalname = "";
        if(err){
            return res.json(err);
        }
        else{
            var files = req.files;
            console.log("files",files);
            if(files !== undefined && files !== null){
                for(let i =0; i<files.length; i++){
                    originalname = files[i].originalname;
                }
                console.log("originalname",originalname);
                finalDocument.set({
                    title:title,
                    type:type,
                    document:originalname
                });
                finalDocument.save((err,data)=>{
                    if(err){
                        console.log("3",err)
                        return res.status(400).json({
                            "status": false,
                            "message": "Message not Found."
                        });
                    }
                    else{
                        return res.json(data);
                    }
                });
            }
        }
    });
}