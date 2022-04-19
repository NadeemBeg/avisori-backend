const mongoose = require("mongoose");

const cardDetailSchema = new mongoose.Schema(
    {
      cardName: {
        type: String,
        trim: true,
        required: true,
      },
      userId:{
        type: String,
        trim: true,
        required: true,
      },
      expiryMonth: {
        type: Number,
        required: true,
      },
      expiryYear: {
        type: Number,
        required: true,
      },
      cardNumber: {
        type: Number,
        required: true,
        maxlength: 16,
      },
      cardType: {
        type: String,
        trim: true,
      },
      stripeCardId: {
        type: String,
        trim: true,
      },
      stripeCustomerId: {
        type: String,
        trim: true,
      },
      stripeTokonId: {
        type: String,
        trim: true,
      },
      isDelete:{
        type:Boolean,
        default:false
      },
      isDefault:{
        type:Boolean,
        default:false
      }
      // cvv:{
      //   type: Number,
      //   required: true,
      // }
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("cardDetail", cardDetailSchema);