const Appointment=require("../models/appointmentModel");
const jwt=require("jsonwebtoken")


const getAllPatientAppointments=async(req,res)=>{
    //replcable with /:id of the uesr
    const tokenPayload=jwt.verify(req.header("x-auth-token"),"thisthesecrettokenkey");
    try{
        const appointments=await Appointment.find({patient:tokenPayload.userId}).exec();
        if(appointments.length==0){
            return res.status(200).json({message:"you have no appointments"});
        }
        res.status(200).json({appointments})
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
};

const getAllClinickAppointmentsByClinickId=async(req,res)=>{
    try{
        const appointments=await Appointment.find({clinick:req.params.clinickId}).exec();
        if(appointments.length==0){
            return res.status(200).json({message:"No appointments was added yet"});
        }
        res.status(200).json({appointments});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
};
const getAppointmentById=async(req,res)=>{
    try{
        const appointment=await Appointment.findById(req.params.appointmentId).exec();
        if(!appointment){
            return res.status(400).json({message:"Bad request"});
        }
        res.status(200).json({appointment});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
};

const addAppointment=async(req,res)=>{
    try{
        const {patient,clinick,appointmentDate,bookingTime,status}=req.body;

        let appointment=new Appointment({
            patient,
            clinick,
            appointmentDate,
            bookingTime,
            status
        })
        await appointment.save();
        res.status(200).json({message:"appointment was saved successfully",appointment});

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
};

const updateAppointmentByPatient=async(req,res)=>{
    try{
        const {patient,clinick,appointmentDate,bookingTime,status}=req.body;

        const appointment=await Appointment.findByIdAndUpdate(req.params.appointmentId,{
            patient,
            clinick,
            appointmentDate,
            bookingTime,
            status
        },{returnOriginal:false}).exec();
        if(!appointment){
            return res.status(400).json({message:"Bad request"});
        }
        res.status(200).json({message:"updated successfully",appointment});

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
};

const updateAppointmentByClinick=async(req,res)=>{
    try{
        const {report,status}=req.body;

        const appointment=await Appointment.findByIdAndUpdate(req.params.appointmentId,{
            report,
            status
        },{returnOriginal:false}).exec();
        if(!appointment){
            return res.status(400).json({message:"Bad request"});
        }
        res.status(200).json({message:"updated successfully",appointment});

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
};
const deleteAppointment=async(req,res)=>{
    try{
        const appointment=await Appointment.findByIdAndDelete(req.params.appointmentId).exec();
        if(!appointment){
            return res.status(400).json({message:"Bad request"});
        }
        res.status(200).json({message:"appointment was deleted successfully",appointment});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
};

module.exports={
    getAllClinickAppointmentsByClinickId,
    getAllPatientAppointments,
    getAppointmentById,
    addAppointment,
    updateAppointmentByClinick,
    updateAppointmentByPatient,
    deleteAppointment
};