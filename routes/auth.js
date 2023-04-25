const validator=require("../middleware/authMWvalidator");
// const User=require("../models/userModel")
const Patient=require("../models/patientModel")
const Doctor=require("../models/doctorModel")

const bcrypt=require("bcrypt");
const router=require("express").Router();

router.post("/login",validator,async(req,res)=>{
    try{
        if(req.body.type.toUpperCase()==="PATIENT"){
            let patient=await Patient.findOne({email:req.body.email}).exec();
            if(!patient){
                return res.status(401).json({message:"Invalid email or password..."})
            }
            const valid=await bcrypt.compare(req.body.password,patient.password);
            if(!valid){
                return res.status(401).json({message:"Invalid email or password..."})
            }

            const token=patient.getAuthToken(patient._id,patient.isAdmin);
            res.cookie("x-auth-token",token,{httpOnly:true});
            res.status(200).json({message:"signed in successfully..."},patient);


        }else if(req.body.type.toUpperCase()==="DOCTOR")
        {
            let doctor=await Doctor.findOne({email:req.body.email}).exec();
            if(!doctor){
                return res.status(401).json({message:"Invalid email or password..."})
            }
            const valid=await bcrypt.compare(req.body.password,doctor.password);
            if(!valid){
                return res.status(401).json({message:"Invalid email or password..."})
            }

            const token=doctor.getAuthToken(doctor._id,doctor.isAdmin);
            res.cookie("x-auth-token",token,{httpOnly:true});
            res.status(200).json({message:"signed in successfully...",doctor});
        }
        //test---------------
        // console.log(req);
        //--------------------------
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
});

router.get("/logout",async(req,res)=>{
    try{
            res.cookie("x-auth-token","",{httpOnly:true});
            res.status(200).json({message:"loged out successfully..."});
        //test---------------
        // console.log(req.body.type.toUpperCase());
        //--------------------------
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
});


module.exports=router;