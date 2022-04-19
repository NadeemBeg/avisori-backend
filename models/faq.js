const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    title: {
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Faq", faqSchema);