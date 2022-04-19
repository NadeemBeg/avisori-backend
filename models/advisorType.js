var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AdvisorType = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Title is required']
    },
	isDelete:{
		type: Boolean,
		default:false
	},
	status:{
		type: Boolean,
		default:true
	}
},{ timestamps: true });

module.exports = mongoose.model("AdvisorType", AdvisorType);