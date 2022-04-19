var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bookCallSchema = new mongoose.Schema(
    {
        userId: {
        	type: Schema.Types.ObjectId,
        	optional: true,
            ref: 'AddMoreInfo'
        },
        advisorId: {
        	type: Schema.Types.ObjectId,
        	optional: true,
        	required: true,
            ref: 'AddMoreInfo'
        },
        total: {
            type: Number,
            default:0
        },
        vat: {
            type: Number,
            default:0
        },
        languageId:{
            type:Schema.Types.ObjectId,
            required: true,
            ref:'Language'
        },
        subCategoryId:{
            type:Schema.Types.ObjectId,
            required: true,
            ref: 'Category'
        },
        categoryId:{
            type:Schema.Types.ObjectId,
            required: true,
            ref: 'Category'
        },
        caseDate:{
            type: String,
            default: new Date()
        },
        caseTime:{
            type: String,
            default: "00:00"
        },
        transactionId:{
            type: String,
        },
        note:{
            type: String,
            optional: true,
            default:"",
        },
        status:{
            type: Number,
            default:0
        },
        slots:[
            {
                startTime:{
                    type: String,
                    default:"00:00 AM"
                },
                endTime:{
                    type: String,
                    default:"00:00 AM"
                },
                charge:{
                    type:Number,
                    default:0
                }
            }
        ],
        caseNumber:{
            type:Number,
            required:false
        },
        isDelete:{
            type: Boolean,
            default:false
        },
    },
        { timestamps: true }
    );
    module.exports = mongoose.model("bookCall", bookCallSchema);