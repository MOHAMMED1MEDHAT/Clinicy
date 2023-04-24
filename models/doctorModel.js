const mongoose=require('mongoose');
const valid=require('validator');
const jwt=require("jsonwebtoken");
const config=require("config");
const jwtSCRT=config.get("env_var.jwtScreteKey")

const doctorSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50
    },
    specialization:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        validators:{validator(val){
            return valid.isEmail(val);
        }}
    },
    password:{
        type:String,
        required:true,
        minLength:5,
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    image:{
        type:String,
        default:"ImageUrl"
    },
    gender:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    }
});

doctorSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

doctorSchema.set('toJSON',{
    virtuals:true
})

doctorSchema.method("getAuthToken",(id,isAdmin)=>{
    const token=jwt.sign({
        userId:id,
        userType:"Doctor",
        isAdmin:isAdmin
    },jwtSCRT,
    {
        expiresIn:"1M"
    });//expiration option
    //test--------------------------
    // console.log(id,isAdmin);
    //-------------------------
    return token;
});
module.exports =mongoose.model("doctor", doctorSchema);