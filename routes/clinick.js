const validator = require("../middleware/clinickMWvalidator");
const clinic = require("../controller/clinickController");

const router = require("express").Router();

// router.get("/all/:doctorId",clinic.getAllClinicks)
router.get("/", clinic.getAllClinics);

router.get("/:id", clinic.getClinicById);

router.post("/", validator, clinic.addClinic);

router.put("/:id", validator, clinic.updateClinic);

router.delete("/:id", clinic.deletClinic);

module.exports = router;
