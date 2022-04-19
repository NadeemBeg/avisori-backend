const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: Number,
      optional:true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      trim: true,
    },
    swedishName: {
      type: String,
      trim: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      optional: true,
      ref: 'Category',
      default:null
    },
    isDelete:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);