const mongoose = require("mongoose");

const cmsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
      },
    status: {
      type: Number,
      default:1
    },
    isDelete:{
		  type: Boolean,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cms", cmsSchema);