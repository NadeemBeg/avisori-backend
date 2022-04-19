const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
        type: Number,
        default:1,
    },
    selected:{
        type: Number,
        default:0,
    }  
  },
  { timestamps: true }
);

module.exports = mongoose.model("Language", languageSchema);