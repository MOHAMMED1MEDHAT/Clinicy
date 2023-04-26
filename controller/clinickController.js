const Clinick=require("../models/clinickModule");
const ResDates=require("../models/reservedDatesModel");
const dateCalc=require("../util/dateCalculations");

const jwt =require("jsonwebtoken");
const config=require("config");
const { default: mongoose } = require("mongoose");
const jwtSCRT=config.get("env_var.jwtScreteKey")


//with doctorId as params
// const getAllClinicks=async(req,res)=>{
//     try{
//         let clinicks=await Clinick.find({doctor:req.params.doctorId}).exec();
//         if(clinicks.length==0){
//             return res.status(200).json({message:"No clinick was added yet"});
//         }
//         res.status(200).json({clinicks});
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message:"Internal server error"});
//     }
// }

//with doctorId from jwt
const getAllClinicks=async(req,res)=>{
    try{
        //replcable with /:id of the user
        const tokenPayload=jwt.verify(req.header("x-auth-token"),jwtSCRT);
        if(tokenPayload.userType.toUpperCase()==="DOCTOR"){
            let clinicks=await Clinick.find({doctor:tokenPayload.userId}).select(" -doctor -reservedDates").exec();
            if(clinicks.length==0){
                return res.status(200).json({message:"No clinick was added yet"});
            }
            res.status(200).json({clinicks});
        }else{
            return res.status(401).json({message:"UNAUTHORIZED ACTION"})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
}

const getClinickById=async(req,res)=>{
    try{
        //id validation
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).json({message:"Invalid clinic id"});
        }

        const resDate=await ResDates.find({clinicId:req.params.id}).select("-_id day time").exec();

        const clkReservedDates=await Clinick.findByIdAndUpdate(req.params.id,{
            reservedDates:resDate
        }).exec()

        const clinick=await Clinick.findById(req.params.id)
        .populate({
            path:"doctor",
            select:"name"
        }).exec();
        if(!clinick){
            return res.status(400).json({message:"Bad request"});
        }
        res.status(200).json({clinick});

    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
};

const addClinick=async(req,res)=>{
    try{
        //replcable with /:id of the user
        const tokenPayload=jwt.verify(req.header("x-auth-token"),jwtSCRT);

        const {phone,clinicName,location,specialization,price,openDates,rating,about}=req.body;

        let clinick=new Clinick({
            doctor:tokenPayload.userId,
            clinicName,
            phone,
            location,
            specialization,
            price,
            openDates,
            rating,
            about
        });
        await clinick.save();
        await createReservedDatesRecord(clinick._id,clinick.openDates);



        res.status(200).json({message:"clinick was added successfully",clinick});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
};

const updateClinick=async(req,res)=>{
    try{
        //id validation
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).json({message:"Invalid clinic id"});
        }
        const {phone,location,specialization,price,openDates}=req.body;

        const clinick=await Clinick.findByIdAndUpdate(req.params.id,{
            phone,
            location,
            specialization,
            price,
            openDates,
        },{returnOriginal:false}).exec();
        if(!clinick){
            return res.status(400).send("Bad reqest");
        }
        res.status(200).json({message:"Clinick was updated successfully",clinick});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"})
    }
};


const deletClinick=async(req,res)=>{
    try{
        //id validation
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).json({message:"Invalid clinic id"});
        }

        const clinick=await Clinick.findByIdAndDelete(req.params.id).exec();
        if(!clinick){
            return res.status(400).json({message:"Bad request from delete"});
        }
        res.status(200).json({message:"Clinick was deleted successfully",clinick});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
};

module.exports={
    getAllClinicks,
    getClinickById,
    addClinick,
    updateClinick,
    deletClinick,
};

const createReservedDatesRecord=async(clinicId,dates)=>{
    const {days,time}=dates
    //test--------
    console.log(days,time);
    //-------------------------------
    
    let times=[]
    for(let i=0;i<time.length;i++){
        times.push(false)
    }
    let upcomingDays=[]
    days.forEach(day=> {
        upcomingDays.push(dateCalc.getUpcomingDatesForMonth(day.toLowerCase()));
    });
    //test-----------------
    console.log(upcomingDays)
    //----------------------------
    upcomingDays.forEach(async days=>{
        days.forEach(async day=>{
            let datesRecord=new ResDates({
                clinicId,
                day,
                time:times,
            })
            await datesRecord.save();
            console.log("Dates Saved successfully");
        })
    })

}