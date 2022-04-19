const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      trim: true,
      required: true,
    },
    senderId: {
      type: String,
      trim: true,
      required: true,
    },
    messageId:{
      type: String,
      trim: true,
    },

    subject: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
      type: String,
      trim: true,

    },
    isDelete:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);