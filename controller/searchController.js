const Doctor=require("../models/doctorModel");
const Clinic=require("../models/clinickModule");


const searchUsingSpecializtion= async(req,res)=>{
    const {specialization} = req.query;
    //test------
    // console.log(doctorName,specialization)
    //------------------------
    try{
        let searchResults=await Clinic.find({specialization:specialization})
        .populate({
            path:"doctor",
            select:"name"
        })
        .select("-reservedDates")
        .exec();

        if(searchResults.length==0){
            return res.status(204).json({message:"Name or specialization Not found"});
        }

        return res.status(200).json(searchResults)
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error in search router"});
    }
};

const searchUsingDoctorname= async(req,res)=>{
    const {name} = req.query;
    const regex=new RegExp(name,"i")
    // //test------
    // console.log(name)
    // //------------------------
    try{
        let DocSearchResults=await Doctor.find({
            name:regex,
        })
        // .select("-_id -__v")
        // .select("-id")
        .exec();

        if(DocSearchResults.length==0){
            return res.status(204).json({message:"Name Not found"});
        }
        // }else{
        //     const ClinicSearcResults=await Clinic.find()
        //     return res.status(200).json(searchResults)
        // }
        return res.status(200).json(DocSearchResults)
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error in search router"});
    }
};


module.exports={
    searchUsingSpecializtion,
    searchUsingDoctorname,

}