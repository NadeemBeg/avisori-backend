const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    advisorId: {
      type: String,
      required: true,
    },
    regularDay: [
      {
        title: {
          type:String,
          required:false,
          value:"Monday"
        },
        status:{
          type:Number,
          default:0,
        },
        timing:[
          {
            startTime:{
              type:String,
              required:false
            },
            endTime:{
              type:String,
              required:false,
            },
          }
        ]
      },
    ],
    specialDay: [
      {
        title: {
          type:String,
          required:false,
        },
        date:{
          type: String,
          default: new Date(),
        },
        status:{
          type:Number,
          default:0,
        },
        timing:[
          {
            startTime:{
              type:String,
              required:false
            },
            endTime:{
              type:String,
              required:false
            },
          }
        ]
      }
    ],
    selected:{
        type: Number,
        default:0,
    },
    isDelete:{
      type:Boolean,
      default:false
    } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Availability", availabilitySchema);