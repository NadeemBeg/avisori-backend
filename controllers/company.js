const GetcompanyData = require("../models/company");

exports.addCompany = (req, res) => {
    const companyData = new GetcompanyData(req.body);
    const title = companyData.title;
    if(title == null || title == ""){
        return res.json("Please Enter Title")
    }
    else{
        GetcompanyData.findOne({title},(err, compnay)=>{
            if(err){
                return res.status(400).json({
                    err: "NOT able to save user in DB"
                });
            }
            else{
                console.log("res",compnay);
                if(compnay == null){
                    companyData.save((err,data)=>{
                        if(err){
                            console.log(err)
                            return res.status(400).json({
                                err: "NOT able to save user in DB"
                            });
                        }
                        else{
                            res.json({
                                "status": 1,
                                "message": "Add data Successfully.",
                                "Compnay": {
                                    id:1,
                                    title : data.title,
                                }
                            })
                        }
                    });
                }
                else{
                    return res.json("Company Already exist");
                }
            }
        });
        
    }
};