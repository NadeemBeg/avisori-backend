const mongoose = require("mongoose");

const manageDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    document: {
      type: String,
      required: true,
    },
    isDelete:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("manageDocument", manageDocumentSchema);