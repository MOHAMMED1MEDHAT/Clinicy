const mongoose=require('mongoose');
const valid=require('validator');
const jwt=require("jsonwebtoken");
const config=require("config");
const jwtSCRT=config.get("env_var.jwtScreteKey")

const patientSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50
    },
    email:{
        type:String,
        required:true,
        validators:{validator(val){
            return valid.isEmail(val);
        }}
    },password:{
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

patientSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

patientSchema.set('toJSON',{
    virtuals:true
})

patientSchema.method("getAuthToken",(id,isAdmin)=>{
    const token=jwt.sign({
            userId:id,
            userType:"patient",
            isAdmin:isAdmin
        },
        jwtSCRT,
        {
            expiresIn:'365d'
        });
    //test--------------------------
    // console.log(id,isAdmin);
    //-------------------------
    return token;
});

module.exports =mongoose.model("patient", patientSchema);