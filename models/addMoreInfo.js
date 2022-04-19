var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var addMoreInfo = new mongoose.Schema(
{
	// userId: {
	// 	type: Number,
	// 	optional: true,
	// 	unique:true,
	// 	required: true,
	// },
	profilePic:{
		type: String,
		trim:true,
		optional: true,
	},
	token: {
		type: String,
		trim: true,
		unique: true
	},
	bankId:{
		type: String,
		optional: true,
	},
	deviceToken:{
		type: String,
		optional: true,
	},
	deviceType:{
		type: Number,
		default:1,
	},
	email: {
		type: String,
		optional: true,
	},
	phoneNumber: {
		type: String,
		optional: true,
	},
	firstName: {
		type: String,
		optional: true,
		maxlength: 32,
		minlength:3
	},
	lastName: {
		type: String,
		optional: true,
		maxlength: 32,
		minlength:3
	},
	advisorType:{
		type: Schema.Types.ObjectId,
		optional: true,
		ref: 'AdvisorType'
	},
	companyId:{
		type: Schema.Types.ObjectId,
		optional: true,
		ref: 'Company'
	},
	speciality:{
		type:Array,
		optional:true
	},
	languages:{
		type:Array,
		optional:true,
	} ,
	isNewUser:{
		type:Number,
		default: 0
	},
	userType:{
		type:Number,
		default: 1
	},
	organisationNumber:{
		type:Number,
		optional:true
	},
	profileCompleted:{
		type:Number,
		default:0
	},
	notificationStatus:{
		type:Number,
		default:0
	},
	isOnline:{
		type:Number,
		default:0
	},
	rating:{
		type:Number,
		default:0.0
	},
	description:{
		type:String,
		default:"Lorem Ipsum"
	},
	isCompanyAdmin:{
		type: Boolean,
		default:false
	},
	isDelete:{
		type: Boolean,
		default:false
	}
},
	{ timestamps: true }
);
module.exports = mongoose.model("AddMoreInfo", addMoreInfo);