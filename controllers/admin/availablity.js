const Getavailability = require("../../models/availability");

exports.getAvailability = (req, res)=>{
    const {advisorId} = req.body;
    Getavailability.findOne({advisorId:advisorId},(err, data) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                error: "NO Data found"
            });
        }
        else{
            return res.json({
                "status": 1,
                "message": "Time listed Successfully.",
                "data":{
                    reformattedData:data
                }
            });
        }
    });
};

/*
exports.addAvailability = (req, res) => {
    const {advisorId} = req.body;
    const dataAvailable = new Getavailability(req.body);
    dataAvailable.set("advisorId",advisorId);
    dataAvailable.save((err, data) => {
        if (err) {
          return res.status(400).json({
            status: 0,
            message: "Unable to get availablity."
          });
        }
        res.status(201).json({ 
            status:1,
            message: 'availablity added successfully',
            data 
        });
    });
}
*/

exports.addAvailability = (req, res) => {
    const {advisorId} = req.body;
    Getavailability.update({advisorId}, req.body, {upsert: true, setDefaultsOnInsert: true}, (err, data) => {
        if (err) {
          return res.status(400).json({
            status: 0,
            message: "Unable to get availablity."
          });
        }
        res.status(201).json({ 
            status:1,
            message: 'availablity added successfully',
            // data 
        });
    })
}