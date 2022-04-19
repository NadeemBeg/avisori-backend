var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var invoiceSchema = new Schema({
    companyId:{
		type: Schema.Types.ObjectId,
		optional: true,
		ref: 'company'
	},
    vatNumber:{
        type:String,
		optional:true,
        trim: true
    },
    bankgiro:{
        type:String,
		optional:true,
        trim: true
    },
    bankAccount: {
        type:String,
		optional:true,
        trim: true
    },
    bankNumber:{
        type:String,
		optional:true,
        trim: true
    },
	isDefault:{
		type: Boolean,
		default:false
	},
	isDelete:{
		type: Boolean,
		default:false
	}
},{ timestamps: true })

module.exports = mongoose.model("invoice", invoiceSchema);