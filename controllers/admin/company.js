const Company = require('../../models/company');
const Invoice = require('../../models/invoice');
const User = require('../../models/addMoreInfo');
var multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/companyLogo')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix+'.png')
    }
});

const upload = multer({ storage }).any('company');

exports.addCompany = (req, res) => {
    const id = req.user._id;
    upload(req,res,err => {
        let originalname = '';
        var files = req.files;
        if(files !== undefined && files !== null && files.length > 0){
            originalname = files[0].filename;
        }
        let {title, description, organisationNumber, email, phone, address, vatNumber, bankgiro, bankAccount  } = req.body;
        let companyData = {title, description, organisationNumber, email, phone, address, companyLogo: originalname   } ;
        const company = new Company(companyData);
        company.save((err, company) => {
            if(err){
                res.status(400).json({
                    status: 0,
                    message: "Unable to add company",
                    error:err
                });
            }
            let companyId = company._id;
            let invoieData = {companyId, vatNumber, bankgiro, bankAccount };
            let invoice = new Invoice(invoieData);
            invoice.save((err, invoice) => {
                if(err){
                    res.status(400).json({
                        status: 0,
                        message: "Unable to add invoice",
                        error:err
                    });
                }
            });
            User.findByIdAndUpdate(
                {_id:id},
                {$set: {companyId, isCompanyAdmin: true}},
                { new: false, useFindAndModify: false },
                (err, user)=>{
                    if(err){
                        res.status(400).json({
                            status: 0,
                            message: "Unable to update user",
                            error:err
                        });
                    }
                    res.status(201).json({
                        status: 1,
                        message: 'Company added successfully'
                    })
                }
            )

        })
    })
}

exports.getCompany = (req, res) => {
    // get companyId from user
    let _id = req.user._id;
    User.findOne({_id, isCompanyAdmin: true}).populate('companyId').exec((err, user) => {
        if(err){
            res.status(400).json({
                status: 0,
                message: "Something wents wrong.",
                error: err
            });
        }
        if(user.companyId){
            let companyId = user.companyId._id;
            let invoiceData = [];
            let baseUrl = `${req.protocol}://${req.get('host')}/companyLogo/`;
            Invoice.findOne(
                {companyId, isDelete: false},
                (err, invoice) => {
                    // invoiceData = invoice;
                    let data = {
                        id: user.companyId._id,
                        title: user.companyId.title,
                        description: user.companyId.description,
                        organisationNumber: user.companyId.organisationNumber,
                        email: user.companyId.email,
                        phone: user.companyId.phone,
                        address: user.companyId.address,
                        companyLogo: user.companyId.companyLogo,
                        vatNumber: invoice.vatNumber,
                        bankgiro: invoice.bankgiro,
                        bankAccount: invoice.bankAccount
                    };

                    res.status(200).json({
                        status: 1,
                        message: 'Company fetched successfully.',
                        data,
                        baseUrl
                    })
                }
            );
        }else{
            res.status(400).json({
                status: 0,
                message: "Company not found.",
            });
        }
    })
}


