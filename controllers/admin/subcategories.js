const SubCategory = require("../../models/subCategory");

exports.getSubCategory = (req, res) => {
    SubCategory.find().select('_id name').exec((err, subCategory) => {
        if(err){
            res.status(400).json({
                status: 0,
                message: 'Sub category not found'
            });
        }      
        res.status(201).json({
            status: 1,
            message: 'Sub category fetched successfully',
            data: subCategory
        })  
    });
}