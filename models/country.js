const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    selected:{
        type: Number,
        default:0,
    },
    status: {
      type: Number,
      default:1,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Country", countrySchema);