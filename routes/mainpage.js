// const Doctor=require("../models/doctorModel")
// const Patient=require("../models/patientModel")

// const router=require("express").Router();

// router.get("/",async(req,res)=>{
//     try{
//         const tokenPayload=jwt.verify(req.header("x-auth-token"),"thisthesecrettokenkey");
//         if(tokenPayload.userType==="PATIENT"){
//             let patient=await Patient.findById(tokenPayload.userId,{image:1,type:1}).exec();
//             return res.status(200).json({patient});

//         }else if(tokenPayload.userType==="DOCTOR"){
//             let doctor=await Doctor.findById(tokenPayload.userId,{image:1,type:1}).exec();
//             return res.status(200).json({doctor});

//         }
//     }catch(err){
//         console.log(err)
//         return res.status(500).send("Internal server error")
//     }
// });

// module.exports=router
