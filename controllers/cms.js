const GetCms = require("../models/cms");
exports.addCms = (req, res) => {
    const data = new GetCms(req.body);
    const type =  data.type;
    const description = data.description;
    if(type == "" || type == null){
        return res.json({
            status:false,
            message:"Type not found"
        });
    }
    if(description == "" || description == null){
        return res.json({
            status:false,
            message:"Description not found"
        });
    }
    else{
        data.save((err,cms)=>{
            console.log("errrr",err);
            if (err) {
                return res.status(400).json({
                error: "not connect to DB"
                });
            }
            else{
                return res.json(cms);
            }
        });       
    }
};