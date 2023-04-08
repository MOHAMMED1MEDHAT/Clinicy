const mongoose=require('mongoose');
// const valid=require('validator');
// const jwt=require("jsonwebtoken");

const appointmentSchema=mongoose.Schema({
    patient:{
        type:String,
        required:true,
    },
    clinick:{
        type:String,
        required:true
    },
    appointmentDate:{
        type:Date,
        required:true,
    },
    report:{
        type:String,
    },
    bookingTime:{
        type:Date,
        required:true
    },
    status:{
        type:"string",
        default:"PENDING",
        required:true
    },
    rating:{
        type:Number,
        default:0.0
    }
});

module.exports =mongoose.model("appointments", appointmentSchema);