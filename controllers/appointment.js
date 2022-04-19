const Getappointment = require("../models/appointment");

exports.addAppointment = (req, res) => {
    const data = new Getappointment(req.body);
    const userId = data.userId;
    const advisorId = data.advisorId;
    if(userId =="" ||userId == null)
        return res.json("Please Enter User ID");
    if(advisorId =="" ||advisorId == null)
        return res.json("Please Enter advisor ID");
        
    data.save((err,data)=>{
        if (err) {
            console.log(err);
            return res.status(400).json({
              error: "Some error like 400"
            });
        }
        else{
            res.json({
                "Data":data
            })
        }
    });
}