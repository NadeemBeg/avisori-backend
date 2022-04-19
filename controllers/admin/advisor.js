const User = require('../../models/addMoreInfo');
const Language = require("../../models/language");
const SubCategory = require("../../models/subCategory");
const {isValid} = require('swedish-personal-identity-number-validator');
var multer  = require('multer');

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


exports.addAdvisor = (req, res) =>{
    upload(req,res,err => {
        let {name, title, about, expertise, languages, companyId, bankId} = req.body;
        if(!isValid(bankId)){
            res.status(419).json({
                status: 0,
                message: 'SSN you have provide is invalid.'
            });
        }
        let originalname = '';
        var files = req.files;
        if(files !== undefined && files !== null && files.length > 0 ){
            originalname = files[0].filename;
        }
        let fullname = name.split(' ');
        let reqData = {
            firstName: fullname[0],
            lastName: fullname[1],
            description: about,
            advisorType: title,
            profilePic:originalname,
            speciality: expertise,
            bankId,
            languages,
            companyId
        };
        let user = new User(reqData);
        user.save((err, user) => {
            if(err){
                res.status(400).json({
                    status:0,
                    message: 'Unable to create user'
                });
            }
            res.status(201).json({
                status: 1,
                message: 'Advisor create successfully'
            });
        });
    });
}

exports.updateAdvisor = (req, res) => {
    upload(req,res,err => {
        let { advisorId ,name, title, about, expertise, languages, bankId} = req.body;
        if(!isValid(bankId)){
            res.status(419).json({
                status: 0,
                message: 'SSN you have provide is invalid.'
            });
        }
        let originalname = '';
        var files = req.files;
        if(files !== undefined && files !== null && files.length > 0 ){
            originalname = files[0].filename;
        }
        let fullname = name.split(' ');
        let reqData = {
            firstName: fullname[0],
            lastName: fullname[1],
            description: about,
            advisorType: title,
            speciality: expertise,
            bankId,
            languages,
        };
        if(originalname != ''){
            reqData.profilePic = originalname;
        }
        User.findByIdAndUpdate(
            {_id: advisorId },
            {$set: reqData},
            { new: false, useFindAndModify: false },
            (err, user) => {
                if(err){
                    res.status(400).json({
                        status:0,
                        message: 'Unable to update user',
                        error: err
                    });
                }
            res.status(201).json({
                status: 1,
                message: 'Advisor updated successfully'
            });
        });
    });
}

exports.deleteAdvisor = (req, res) => {
    let { advisorId } = req.body;
    User.findByIdAndUpdate(
        {_id: advisorId },
        {$set: {isDelete: true}},
        { new: false, useFindAndModify: false },
        (error, user) =>{
            if(error){
                res.status(400).json({
                    status:0,
                    message: 'Unable to delete user',
                    error
                });
            }
            res.status(201).json({
                status: 1,
                message: 'Advisor deleted successfully'
            });
        }
    );
}

exports.getAdvisor = async(req, res) => {
    const {advisorId} = req.body;
    await User
    .findById({_id: advisorId, isDelete:false })
    .populate('advisorType')
    .exec(async (err, user) => {
        if(err){
            res.status(400).json({
                status: 0,
                message: 'Unable to get user.',
                error: err
            });
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
            companyId: user.companyId,
            bankId: user.bankId
        };
        let baseUrl = `${req.protocol}://${req.get('host')}/profile/`;
        res.status(200).json({
            status: 1,
            messgae: 'Advisor fetched successfully',
            data,
            baseUrl
        });
    });
}

exports.getAllAdvisors = async (req, res) => {
    const companyId = req.body.companyId;
    const langsAll = await getAllLangs();
    const catisAll = await getAllCates();
    let data = [];
    User.find({ companyId, isCompanyAdmin: false, isDelete: false }).exec(
      async (err, users) => {
        if (err) throw err;
        users.map(async (user) => {
          let languages = [];
          let categories = [];
          let langs = user.languages;
          let cats = user.speciality;
          langs.map(async (lang) => {
            langsAll.find((l) => {
              if (l._id == lang) {
                languages.push(l);
              }
            });
          });
  
          cats.map(async (cati) => {
            catisAll.find((c) => {
              if (c._id == cati) {
                categories.push(c);
              }
            });
          });
          let arr = {
            id: user._id,
            name: user.firstName + " " + user.lastName,
            title: user.advisorType,
            about: user.description,
            profilePic: user.profilePic,
            expertise: categories,
            languages: languages,
            companyId: user.companyId,
          };
          data.push(arr);
        });
        // res.json(data);
        res.status(201).json({
            status: 1,
            message: 'All advisored fetched successfully',
            data
        })
      }
    );
  };
  
  const getAllLangs = () => {
    return new Promise(function (resolve, reject) {
      Language.find()
        .select("name")
        .exec((err, langs) => {
          resolve(langs);
        });
    });
  };
  
  const getAllCates = () => {
    return new Promise(function (resolve, reject) {
      SubCategory.find()
        .select("name")
        .exec((err, cates) => {
          resolve(cates);
        });
    });
  };



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

