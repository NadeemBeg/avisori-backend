var mongoose = require("mongoose");

var appointment = new mongoose.Schema(
    {
        userId: {
        	type: String,
        	optional: true,
        	required: true,
        },
        advisorId: {
        	type: String,
        	optional: true,
        	required: true,
        },
        startDate:{
            type: Date,
            default: Date.now
        },
        startTime:{
            type: String,
            default:"00:00:00"
        },
        endDate:{
            type: Date,
            default: Date.now 
        },
        endTime:{
            type: String,
            default:"00:00:00"
        },
        isDelete:{
            type: Boolean,
            default:false
        },
        status:{
            type: Number,
            default:0
        }
    },
        { timestamps: true }
    );
    module.exports = mongoose.model("Appointment", appointment);