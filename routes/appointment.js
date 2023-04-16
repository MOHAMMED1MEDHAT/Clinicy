const validator=require("../middleware/appointmentMWvalidator");
const appointment=require("../controller/appointmentController");

const router=require("express").Router();

router.get("/patient",appointment.getAllPatientAppointments);

router.get("/",appointment.getAllAppointments);

router.get("/clinic/:clinicId",appointment.getAllClinickAppointmentsByClinickId);

router.get("/:appointmentId",appointment.getAppointmentById);

router.post("/",validator,appointment.addAppointment);

router.put("/patient/:appointmentId",validator,appointment.updateAppointmentByPatient);

router.put("/clinick/:appointmentId",validator,appointment.updateAppointmentByClinick);

router.delete("/:appointmentId",appointment.deleteAppointment);

module.exports=router;