const ManageDocument = require('../../models/manageDocument');
var moment = require('moment');

exports.getAllDocs = (req, res) => {
    ManageDocument.find({isDelete: false},(err, docs) => {
        if(err){
            res.status(400).json({
                status: 0,
                message: 'something wents wrong',
                error: err
            })
        }
        let baseUrl = `https://advisori-admin.herokuapp.com/uploads/manageDocuments/`;
        // let baseUrl = `${req.protocol}://${req.get('host')}/uploads/manageDocuments/`;
        let data = [];
        docs.map((doc) => {
            let arr = {
                id: doc._id,
                document: doc.title,
                entity: doc.type,
                signed_date: moment(doc.createdAt).format('MMM Do, YYYY at h:mm a'),
                status: 'signed',
                docName: doc.document 
            };
            data.push(arr);
        })
        res.status(200).json({
            status: 1,
            message: "documents fetched successfully",
            data,
            baseUrl
        })
    });
}