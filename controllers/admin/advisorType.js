const AdvisorType = require('../../models/advisorType');

exports.addAdvisorType = (req, res) => {
    const advisorType = new AdvisorType(req.body);
    advisorType.save((error, type) => {
        if(error){
            res.status(400).json({
                status: 0,
                message: 'Unable to add type'
            });
        }

        res.status(201).json({
            status:1,
            message: 'type added successfully'
        });
    });
}

exports.getAllAdvisorType = (req, res) =>{
    AdvisorType.find({isDelete: false} , (error, types) =>{
        if(error){
            res.status(400).json({
                status: 0,
                message: 'Unable to get types'
            });
        }
        res.status(201).json({
            status:1,
            message: "Types fetched successfully.",
            data: types
        })
    })
}