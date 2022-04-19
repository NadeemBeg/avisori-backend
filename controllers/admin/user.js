const User = require('../../models/addMoreInfo');
var multer  = require('multer');
const Language = require("../../models/language");
const SubCategory = require("../../models/subCategory");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/profilePics')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix+'.png')
    }
})   
 
const upload = multer({ storage }).any('addMoreInfo');


exports.getProfile = async (req, res) => {
    let id = req.user._id;
    await User.findById(id).populate('advisorType').exec(async function(err,user){
        if(err){
            res.status(400).json({
                status: 0,
                message: 'User not found.'
            })
        }
        let langs = user.languages;
        let cats = user.speciality;
        let languages = [];
        let categories = [];
        for(a of langs) {
            let proms = await getLang(a);
            languages.push(proms);
        };
        for(a of cats) {
            let proms = await getSubCategory(a);
            categories.push(proms);
        };
        let data = {
            id: user._id,
            name: user.firstName+' '+user.lastName,
            title: { _id: user.advisorType._id ,title: user.advisorType.title },
            about: user.description,
            profilePic: user.profilePic,
            expertise: categories,
            languages: languages,
        }
        let baseUrl = `${req.protocol}://${req.get('host')}/profile/`;
        res.status(200).json({
            status: 1,
            message: 'profile fetched successfully',
            data,
            baseUrl
        })
    });
}

exports.updateProfile = (req, res) => {
    // console.log(req.user);
    const id = req.user._id;
    upload(req,res,err => {
        let originalname = '';
        var files = req.files;
        if(files !== undefined && files !== null && files.length > 0){
            originalname = files[0].filename;
        }
        let {name, title, about, profilePic, expertise, languages} = req.body;
        let fullname = name.split(' ');
        let reqData = {
            firstName: fullname[0],
            lastName: fullname[1],
            description: about,
            advisorType: title,
            speciality: expertise,
            languages
        };
        if(originalname!=''){
            reqData.profilePic = originalname;
        }
        User.findByIdAndUpdate(
            {_id:id},
            {$set: reqData},
            { new: false, useFindAndModify: false },
            (err, user) => {
                if(err){
                    res.status(400).json({
                        status: 0,
                        message: err
                    })
                }
                res.status(200).json({
                    status: 1,
                    message: 'profile updated successfully',
                })
            }
        )

    })
    
}   




const getLang = async (_id) => {
    return new Promise(function(resolve, reject) {
        Language.findById(_id).select('name').exec((err, lang) => {
            resolve({id: lang._id, name: lang.name })
        });
    })
}

const getSubCategory = async(_id) => {
    return new Promise(function(resolve, reject) {
        SubCategory.findById(_id).select('name').exec((err, cat) => {
            resolve({ id: cat._id , name: cat.name})
        });
    })
}   