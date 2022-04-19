const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      optional:true
    },
    companyLogo:{
      type: String,
      trim: true,
      optional:true
    },
    organisationNumber:{
      type: String,
      trim: true,
      optional:true
    },
    email:{
      type: String,
      trim: true
    },
    phone:{
      type: String,
      trim: true
    },
    address:{
      type: String,
      trim: true
    },
    status: {
      type: Number,
      default:0
    },
    isDelete:{
      type: Boolean,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);