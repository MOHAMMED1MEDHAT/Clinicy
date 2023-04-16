const Clinick=require("../models/clinickModule");

const jwt =require("jsonwebtoken");
const config=require("config")
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
            let clinicks=await Clinick.find({doctor:tokenPayload.userId})
            populate({
                path:"doctor",
                select:"name"
            }).exec();
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
        const clinick=await Clinick.findById(req.params.id)
        .populate({
            paht:"doctor",
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

        const {phone,location,specialization,price,openDates,rating}=req.body;

        let clinick=new Clinick({
            doctor:tokenPayload.userId,
            phone,
            location,
            specialization,
            price,
            openDates,
            rating
        });
        await clinick.save();
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