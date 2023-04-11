const mongoose=require('mongoose');
// const valid=require('validator');
// const jwt=require("jsonwebtoken");

const clinickSchema=mongoose.Schema({
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"doctors",
        required:true,
    },
    phone:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true,
    },
    specialization:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    openDates:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        default:0.0
    },
    ratingCount:{
        type:Number,
        default:0,
    }
});

module.exports =mongoose.model("clinick", clinickSchema);