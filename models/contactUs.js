const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema(
  {
    email: {
		type: String,
		optional: true,
	},
	mobile: {
		type: String,
		optional: true,
	},
    address: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("contactUs", contactUsSchema);
