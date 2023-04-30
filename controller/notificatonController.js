const Notification=require("../models/notificationModel");
const Appointment=require("../models/appointmentModel");

const jwt =require("jsonwebtoken");
const config=require("config");
const { default: mongoose } = require("mongoose");
const { not } = require("ajv/dist/compile/codegen");
const jwtSCRT=config.get("env_var.jwtScreteKey")

//with doctorId from jwt
// const getAllDoctorNotification=async(req,res)=>{
//     try{
//         let customResponse={}
//         //replcable with /:id of the user
//         const tokenPayload=jwt.verify(req.header("x-auth-token"),jwtSCRT);
        
//         const appointment=await Appointment.find()
//         .populate({
//             path:"patient",
//             // select:"-_id"
//         })
//         .populate({
//             path:"clinick",
//             select:"-reservedDates -openDates",
//             populate:{
//                 path:"doctor",
//                 match:""
//                 select:"name"
//             }}).exec();
        
//         res.status(200).json(clinicks);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message:"Internal server error"});
//     }
// }

const getAllPatientNotification=async(req,res)=>{
    try{
        let customResponseList=[]
        let customResponse={}
        //replcable with /:id of the user
        const tokenPayload=jwt.verify(req.header("x-auth-token"),jwtSCRT);

        const appointments=await Appointment.find({patient:tokenPayload.userId})
        .populate({
            path:"clinick",
            select:"-reservedDates -openDates",
            populate:{
                path:"doctor",
                select:"name"
            }})
        .exec();

        // setting customResponse values 
        for (let i = 0; i < appointments.length; i++) {
            // console.log(appointment)
            const notification=await Notification.findOne({appointmentId:appointments[i]._id}).exec();
            customResponse.clinicName=appointments[i].clinick.clinicName;
            customResponse.doctorName=appointments[i].clinick.doctor.name;
            customResponse.sepcialization=appointments[i].clinick.specialization;
            customResponse.appointmentDate=appointments[i].appointmentDate;
            customResponse.bookingTime=appointments[i].bookingTime;
            customResponse.typeOfNotification=notification.typeOfNotification;
            customResponseList.push(customResponse)
            customResponse={}
        };
        // const notifications=await Notification.findOne({appointmentId:appointment._id}).exec();

        console.log(customResponseList)
        
        console.log(customResponseList.length)
        if(customResponseList.length==0){
            return res.status(204).json({message:"no notification"});
        }
        res.status(200).json(customResponseList)

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
}

const addNotification=async(appointmentId)=>{
    try{
        let notification=new Notification({
            appointmentId,
            typeOfNotification:"NEW"
        });
        await notification.save();
        console.log("Notification added successfully",notification)

    }catch(err){
        console.log(err);
    }
};

const deleteNotification=async(req,res)=>{
    try{
        //id validation
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).json({message:"Invalid clinic id"});
        }

        const clinick=await Clinick.findByIdAndDelete(req.params.id).exec();
        if(!clinick){
            return res.status(400).json({message:"Bad request"});
        }
        res.status(200).json({message:"Clinick was deleted successfully",clinick});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
};

module.exports={
    // getAllDoctorNotification,
    getAllPatientNotification,
    addNotification,
    deleteNotification,
};