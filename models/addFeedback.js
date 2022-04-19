const mongoose = require("mongoose");

const addFeedbackSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    advisorId: {
        type: String,
        required: true,
      },
    adviceSeekerId: {
        type: String,
        required: true,
    },
    comment:{
      type: String,
      required: true,
    },
    rating:{
        type:Number,
        required: true,
        default:0
    },
    isDelete:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("addFeedback", addFeedbackSchema);