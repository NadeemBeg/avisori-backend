const Language = require("../../models/language");

exports.getLanguages = (req, res) => {
    Language.find().select('_id name').exec((err, languages) => {
        if(err){
            res.status(400).json({
                status: 0,
                message: 'languages not found'
            });
        }      
        res.status(201).json({
            status: 1,
            message: 'languages fetched successfully',
            data: languages
        })  
    });
}