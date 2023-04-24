// const User=require("../models/userModel");
const Patient=require("../models/patientModel");
const Doctor=require("../models/doctorModel");

const jwt=require("jsonwebtoken");
const config=require("config")
const jwtSCRT=config.get("env_var.jwtScreteKey")


const getUserData=async(req,res)=>{
    try{
        //replcable with /:id
        const tokenPayload=jwt.verify(req.header("x-auth-token"),jwtSCRT);
        //test---------
        // console.log(tokenPayload)
        //----------------------------
        if(tokenPayload.userType.toUpperCase()==="PATIENT"){
            let patient=await Patient.findById(tokenPayload.userId).select("name email image type").exec();
            if(!patient){
                return res.status(400).json({message:"Bad request"})
            }
            res.status(200).json({...patient});

        }else if(tokenPayload.userType.toUpperCase()==="DOCTOR"){
            let doctor=await Doctor.findById(tokenPayload.userId,{name:1,email:1,image:1,type:1}).exec();
            if(!doctor){
                return res.status(400).json({message:"Bad request"})
            }
            res.status(200).json({...doctor});
        }

    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Internal server error"})
    }
};

const updateUserData=async(req,res)=>{
    try{
        //replcable with /:id
        const tokenPayload=jwt.verify(req.header("x-auth-token"),jwtSCRT);
        if(tokenPayload.userType.toUpperCase()==="PATIENT"){
            let patient=await Patient.findByIdAndUpdate(tokenPayload.userId,{
                name:req.body.name,
                image:req.body.imageUrl
            },{returnOriginal:false}).exec();
            if(!patient){
                return res.status(400).json({message:"Bad request"});
            }
            res.status(200).json({...patient})

        }else if(tokenPayload.userType.toUpperCase()==="DOCTOR"){
            let doctor=await Doctor.findByIdAndUpdate(tokenPayload.userId,{
                name:req.body.name,
                image:req.body.imageUrl
            },{returnOriginal:false}).exec();
            if(!doctor){
                return res.status(400).json({message:"Bad request"});
            }
            res.status(200).json({...doctor})
        }

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"})
    }
};

const deleteUserData=async(req,res)=>{
    try{
        //replcable with /:id
        const tokenPayload=jwt.verify(req.header("x-auth-token"),jwtSCRT);
        if(tokenPayload.userType.toUpperCase()==="PATIENT"){
            let patient=await Patient.findByIdAndDelete(tokenPayload.userId).exec();
            if(!patient){
                return res.status(400).json({message:"Bad request"});
            }
            res.status(200).json({message:"deleted successfully"});

        }else if(tokenPayload.userType.toUpperCase()==="DOCTOR"){
            let doctor=await Doctor.findByIdAndDelete(tokenPayload.userId).exec();
            if(!doctor){
                return res.status(400).json({message:"Bad request"});
            }
            res.status(200).json({message:"deleted successfully"});
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"})
    }
};

module.exports={
    getUserData,
    updateUserData,
    deleteUserData
}