const GetCategory = require("../models/category");
const GetSubCategory = require("../models/subCategory");
const AddMoreInfo = require("../models/addMoreInfo");
const GetLanguage = require("../models/language");

exports.addCategory = async(req, res) => {
    
    const title = req.body.title;
    const swedishName = req.body.swedishName;

    if(title == "" || title == null){
        return res.json("Please Enter Title");
    }
    if(swedishName == "" || swedishName == null){
        return res.json("Please Enter Swedish Name");
    }
    await GetCategory.findOne({parentId:null,title:title },(err, user) => {
        if (err) {
            console.log("err",err);
            return res.status(400).json({
                error: "category Id does not exists"
            });
        }
        if(user !== null){
            return res.json("Category Already Exist.")
        }
        else{
            const categoryData = new GetCategory(req.body);
            categoryData.save((err, category) => {
                if(err){
                    console.log("err",err);
                    return res.status(400).json({
                        err: "NOT able to save user in DB"
                    });
                }
                else{
                    res.json({
                        "status": 1,
                        "message": "Add data Successfully.",
                        "categoryDetail": {
                            categoryId: category._id,
                            title : category.title,
                            swedishName:category.swedishName,
                            image : category.image,
                        }
                    })
                }
            });
        }
    });
    
};
exports.addSubCategory = (req, res) => {
    console.log("req.body",req.body);
    const parentId = req.body.parentId;
    const title = req.body.title;
    console.log("parentId",parentId);
    if(parentId == "" || parentId == null){
        return res.json("Please Enter Category ID");
    }
    if(title == "" || title == null){
        return res.json("Please Enter Category title");
    }
    const subCategoryData = new GetCategory(req.body);
    subCategoryData.save((err, subcategory)=>{
        if(err){
            console.log("err",err);
            return res.status(400).json({
                err: "NOT able to save user in DB"
            });
        }
        else{
            res.json({
                "status": 1,
                "message": "Add data Successfully.",
                "SubcategoryDetail": {
                    categoryId: subcategory.parentId,
                    name : subcategory.name,
                    image : subcategory.image,
                }
            });
        }
    })
};

exports.listSubCategory = (req, res) => {
    const subCategoryData = (req.body);
    const categoryId = subCategoryData.categoryId;
    var categoryName = "";

    GetCategory.findOne({_id:categoryId }, (err, categoryData) => {
        if (err) {
            return res.status(400).json({
                error: "category Id does not exists"
            });
        }
        if(categoryData == null){
            return res.json({
                "status": false,
                "message": "Category Not Exist.",
            });
        }
        else{
            categoryName = categoryData.title;
            GetCategory.find({isDelete:false,parentId:categoryId}).exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        "status": false,
                        "message": "Category Not Exist.",
                    });
                }
                else{
                    const reformattedData = data && data.map((item, index) => ({
                        id : item._id,
                        name : item.name,
                        image : item.image,
                        swedishName:item.swedishName,
                        "status": 1
                    }));
                    res.json({
                        "status": 1,
                        "message": "Get data Successfully.",
                        "data":{
                            "categoryName": categoryName,
                            "list":reformattedData
                        }
                    })
                }
            });
        }
        
    });
};

exports.listLanguagesByServices = async(req, res) => {
    var subCategoryName = req.body;
    console.log("subcategoryName",subCategoryName);
    const allLanguages=[];
    // const uniqueLanguage=[];
    var subCategoryId = subCategoryName._id;
    var subCategoryName;
    console.log("subCategoryId",subCategoryId);
    await GetCategory.findById(subCategoryId,async(err,subCategoryData)=>{
        if (err) {
            return res.status(400).json({
              error: "Not found data."
            });
        }
        else{
            console.log("subCategoryData",subCategoryData);
            if(subCategoryData !== null){
                await AddMoreInfo.find({speciality:{$in:subCategoryId}},async(err,data)=>{
                    if (err) {
                        return res.status(400).json({
                          error: "Not found data."
                        });
                    }
                    else{
                        console.log("data",data);
                        for(var i =0; i<data.length; i++){
                            var languageArr = data[i].languages;
                            for(var j = 0; j<languageArr.length; j++){
                                allLanguages.push(languageArr[j]);
                            }
                        }
                        console.log("allLanguages",allLanguages);
                        const unique = Array.from(new Set(allLanguages));
                        console.log("unique",unique);
                        await GetLanguage.find({_id:{$in:unique}}).exec(async(err,details)=>{
                            if (err) {
                                return res.status(400).json({
                                    error: "Not found data."
                                });
                            }
                            else{
                                if(details !== null){
                                    console.log("details details",details);
                                    const reformattedData = details && details.map((item, index) => ({
                                        id : item._id,
                                        name : item.name,
                                        image : item.image,
                                        isSelected:item.selected,
                                        status: item.status
                                    }));
                                    return res.json({
                                        "status": 1,
                                        "message": "Get data Successfully.",
                                        "data": {
                                            "subCategoryName" : subCategoryData.name,
                                            "List":reformattedData
                                        }
                                    });
                                }
                                else{
                                    return res.json({
                                        "status": 1,
                                        "message": "Get data Successfully.",
                                        "data": {
                                            "subCategoryName" : '',
                                            "List":[]
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
            else{
                return res.json({
                    "status": 1,
                    "message": "Get data Successfully.",
                    "data": {
                        "subCategoryName" : '',
                        "List":[]
                    }
                });
            }
        }
    });
    
}