const mongoose=require('mongoose');
const valid=require('validator');
const jwt=require("jsonwebtoken");

const userSchema=mongoose.Schema({
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
    type:{
        type:String,
    }
});

userSchema.method("getAuthToken",(id,isAdmin)=>{
    const token=jwt.sign({
        userId:id,
        isAdmin:isAdmin
    },"thisthesecrettokenkey");
    //test--------------------------
    // console.log(id,isAdmin);
    //-------------------------
    return token;
});
module.exports =mongoose.model("Users", userSchema);