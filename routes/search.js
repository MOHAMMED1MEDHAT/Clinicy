const search=require("../controller/searchController");
const router=require("express").Router();

router.get("/specialization",search.searchUsingSpecializtion)

router.get("/specializationAndName",search.searchUsingDoctorname)

module.exports=router;