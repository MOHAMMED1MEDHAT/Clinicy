// const validator=require("../middleware/notificationMWvalidator");
const notification=require("../controller/notificatonController");

const router=require("express").Router();

// router.get("/all/:doctorId",clinick.getAllClinicks)
router.get("patient/",notification.getAllPatientNotification)

// router.get("doctor/",notification.getAllDoctorNotification)

// router.post("/",notification.addNotification);

router.delete("/:id",notification.deleteNotification);

module.exports=router;