const mongoose=require('mongoose');
// const valid=require('validator');
// const jwt=require("jsonwebtoken");

const notificationSchema=mongoose.Schema({
    appointmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"appointment",
        required:true,
    },
    typeOfNotification:{
        type:String,
        default:"new",
        required:true
    }
});

notificationSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

notificationSchema.set('toJSON',{
    virtuals:true
})

module.exports =mongoose.model("appointments", notificationSchema);