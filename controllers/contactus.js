const ContactUs = require("../models/contactUs");

exports.getContactUs = (req, res) => {
    ContactUs.find().select('email address mobile').exec((err, conatctDetail) => {
        if(err){
            res.status(400).json({
                status: 0,
                message: 'Contact not found'
            });
        }      
        res.status(201).json({
            status: 1,
            message: 'Contact fetched successfully',
            data: conatctDetail
        })  
    });
}