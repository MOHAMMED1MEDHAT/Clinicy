const Doctor=require("../models/doctorModel");


const searchUsingSpecializtion= async(req,res)=>{
    const {specialization} = req.query;
    //test------
    // console.log(doctorName,specialization)
    //------------------------
    try{
        let searchResults=await Doctor.find({
            specialization:specialization,
        },
        {name:1}).exec();

        if(searchResults.length==0){
            return res.json({message:"Name or specialization Not found"});
        }

        return res.status(200).json({searchResults})
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error in search router"});
    }
};

const searchUsingDoctorname= async(req,res)=>{
    const {doctorName} = req.query;
    //test------
    console.log(doctorName)
    //------------------------
    try{
        let searchResults=await Doctor.find({
            name:doctorName,
        }).exec();

        if(searchResults.length==0){
            return res.send("Name or specialization Not found");
        }

        return res.status(200).json({searchResults})
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error in search router"});
    }
};


module.exports={
    searchUsingSpecializtion,
    searchUsingDoctorname,

}