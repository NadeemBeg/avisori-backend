const GetIntroData = require("../models/getIntroData");
const GetContactUs = require("../models/contactUs");

exports.getIntroData = (req, res) => {
	var modifyData="";
  GetIntroData.find({isDelete: false}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: "NO getIntroData found"
      });
    }

    const reformattedData = data && data.map((item, index) => ({
      id : item._id,
      title : item.title,
      image : item.image,
      description: item.description
    }));
    modifyData = {
    	"status":1, 
     	"message": "Get data Successfully.", 
     	"data":reformattedData
    }    
    res.json(modifyData);
  });
};

exports.createIntroData = (req, res) => {
  const introData = new GetIntroData(req.body);
  console.log("introData",introData);
  introData.save((err, introData) => {
    if (err) {
      console.log("err",err)
      return res.status(400).json({
        error: "NOT able to save introData in DB"

      });
    }
    res.json({ introData });
  });
};

exports.createContactUs = (req, res) => {
  const contactUs = new GetContactUs(req.body);

  contactUs.save((err, contactUsData) => {
    if (err) {
      return res.status(400).json({
        error: "NOT able to save contactUs in DB"

      });
    }
    res.json({ contactUsData });
  });
};
