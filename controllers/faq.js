const GetFaqData = require("../models/faq");

exports.addFaqQueAns = (req, res) => {
    const queAnsData = new GetFaqData(req.body);
    const title = queAnsData.title;
    if(title == null || title == ""){
        return res.json("Please Enter Title")
    }
    else{
        queAnsData.save((err,data)=>{
            if(err){
                return res.status(400).json({
                    err: "NOT able to save user in DB"
                });
            }
            else{
                res.json({
                    "status": 1,
                    "message": "Add data Successfully.",
                    "FAQ": {
                        id:data._id,
                        title : data.title,
                        description : data.description,
                        status:data.status
                    }
                })
            }
        });
    }
};
exports.listFaq = (req, res)=>{
    GetFaqData.find().exec((err, data) => {
        if(err){
            return res.status(400).json({
                err: "NOT able to save user in DB"
            });
        }
        else{
            if(data == "" || data == ""){
                return res.json(" Data not found")
            }
            else{
                const reformattedData = data && data.map((item, index) => ({
                    id : item._id,
                    title : item.title,
                    description: item.description,
                    status:item.status
                  }));
                return res.json({
                    "status": 1,
                    "message": "Get data Successfully.",
                    "data": {
                        "list": reformattedData
                    }
                });
            }
        }
    });
};