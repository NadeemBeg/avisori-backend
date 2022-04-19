const mongoose = require("mongoose");

const uploadDocumentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    documents:{
      type: Array,
      required: true,
    },
    isDelete:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("uploadDocument", uploadDocumentSchema);