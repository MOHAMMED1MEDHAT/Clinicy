const mongoose=require('mongoose');
// const valid=require('validator');
// const jwt=require("jsonwebtoken");

const reservedDatesSchema=mongoose.Schema({
    clinicId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"clinick",
        required:true,
    },
    day:{
        type:String,
        required:true
    },
    time:[{
        type:Boolean,
        required:true
    }],
});

reservedDatesSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

reservedDatesSchema.set('toJSON',{
    virtuals:true
})

module.exports =mongoose.model("reservedDate", reservedDatesSchema);