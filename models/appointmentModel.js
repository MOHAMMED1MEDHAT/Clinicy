const mongoose=require('mongoose');
// const valid=require('validator');
// const jwt=require("jsonwebtoken");

const appointmentSchema=mongoose.Schema({
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"patient",
        required:true,
    },
    clinick:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"clinick",
        required:true
    },
    appointmentDate:{
        type:String,
        required:true,
    },
    report:{
        type:String,
    },
    bookingTime:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"PENDING",
        required:true
    },
    rating:{
        type:Number,
        default:0.0
    }
});

module.exports =mongoose.model("appointments", appointmentSchema);