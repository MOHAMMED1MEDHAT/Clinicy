const validator=require("../middleware/userMWvalidator");
const Patient=require("../models/patientModel")
const Doctor=require("../models/doctorModel")
// const User=require("../models/userModel")

const bcrypt=require("bcrypt");
const router=require("express").Router();

router.post("/",validator,async(req,res)=>{
    try{
        //test---------------
        // console.log(req.body.type.toUpperCase());
        //--------------------------
        if(req.body.type.toUpperCase()=="PATIENT"){
            let used=await Patient.findOne({email:req.body.email}).exec();

            if(used){
                return res.status(400).json({message:"email already exists as a patient..."})
            }

            const salt=await bcrypt.genSalt(10);
            const hashedPswrd=await bcrypt.hash(req.body.password,salt);

            let patient=new Patient({
                name:req.body.name,
                email:req.body.email,
                image:req.body.imageUrl,
                password:hashedPswrd,
                type:req.body.type
            })
            await patient.save();
            const token=patient.getAuthToken(patient._id,patient.isAdmin);
            res.cookie("x-auth-token",token,{httpOnly:true});
            res.status(200).json({message:"User was added successfully..."});

        }else if(req.body.type.toUpperCase()=="DOCTOR")
        {
            let used=await Doctor.findOne({email:req.body.email}).exec();
            //test------------
            // console.log(used)
            //----------------
            if(used){
                return  res.status(400).json({message:"email already exists as a doctor ..."});
            }
            const salt=await bcrypt.genSalt(10);
            const hashedPswrd=await bcrypt.hash(req.body.password,salt);

            let doctor=new Doctor({
                name:req.body.name,
                email:req.body.email,
                image:req.body.imageUrl,
                password:hashedPswrd,
                specialization:req.body.specialization,
                type:req.body.type
            })
            await doctor.save();
            const token=doctor.getAuthToken(doctor._id,doctor.isAdmin);
            res.cookie("x-auth-token",token,{httpOnly:true});
            res.status(200).json({message:"User was added successfully..."});
        }

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
});

module.exports=router;