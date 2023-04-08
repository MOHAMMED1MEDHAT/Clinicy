const validator=require("../middleware/profileUpdateMWValidator");
const profile=require("../controller/profileController")

const router=require("express").Router();

router.get("/",profile.getUserData);

router.put("/",validator,profile.updateUserData);

router.delete("/",profile.deleteUserData);



module.exports=router;