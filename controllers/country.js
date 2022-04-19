const GetCountry = require("../models/country");
const GetLanguage = require("../models/language");
exports.addCountry = (req, res) => {
    const data = new GetCountry(req.body);
    const name =  data.name;
    const image = data.image;
    if(name == "" || name == null){
        return res.json({
            status:false,
            message:"Country name not found"
        });
    }
    if(image == "" || image == null){
        return res.json({
            status:false,
            message:"Country image not found"
        });
    }
    else{
        GetCountry.findOne({ name:name }, (err, data1) => {
            if (err) {
                return res.status(400).json({
                    error: "Country Id does not exists"
                });
            }
            if(data1 !== null){
                return res.json("Country Already Exist.")
            }
            else{
                data.save((err,country)=>{
                    console.log("errrr",err);
                    if (err) {
                        return res.status(400).json({
                        error: "not connect to DB"
                        });
                    }
                    else{
                        return res.json(country);
                    }
                });
            }
        });


        
    }
};
exports.getCountry = (req, res) =>{
  var modifyData="";
  GetCountry.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "NO data found"
      });
    }
    const reformattedData = data && data.map((item, index) => ({
      id : item._id,
      name : item.name,
      image : item.image,
      status: item.status,
      isSelected: item.selected
    }));
    modifyData = {
        "status":1, 
          "message": "Get data Successfully.", 
          "data":reformattedData
    }    
    res.json(modifyData);
  });
};
//language apis start
exports.addLanguage = (req, res) => {
    const data = new GetLanguage(req.body);
    const name =  data.name;
    if(name == "" || name == null){
        return res.json("Country name not found");
    }
    else{
        GetLanguage.findOne({ name:name }, (err, data1) => {
            if (err) {
                return res.status(400).json({
                    error: "language Id does not exists"
                });
            }
            if(data1 !== null){
                return res.json("language Already Exist.")
            }
            else{
                 data.save((err,language)=>{
                    console.log("errrr",err);
                    if (err) {
                        return res.status(400).json({
                            error: "not connect to DB"
                        });
                    }
                    else{
                        return res.json(language);
                    }
                });
            }
        });
       
    }
};
exports.getLanguages = (req, res) =>{
    var modifyData="";
    GetLanguage.find().exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "NO data found"
        });
      }
      const reformattedData = data && data.map((item, index) => ({
        id : item._id,
        name : item.name,
        image : item.image,
        status: item.status,
        isSelected: item.selected
      }));
      modifyData = {
          "status":1, 
            "message": "Get data Successfully.", 
            "data":reformattedData
      }    
      res.json(modifyData);
    });
  };