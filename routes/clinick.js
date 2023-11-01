const validator = require("../middleware/clinickMWvalidator");
const clinick = require("../controller/clinickController");

const router = require("express").Router();

// router.get("/all/:doctorId",clinick.getAllClinicks)
router.get("/", clinick.getAllClinicks);

router.get("/:id", clinick.getClinickById);

router.post("/", validator, clinick.addClinick);

router.put("/:id", validator, clinick.updateClinick);

router.delete("/:id", clinick.deletClinick);

module.exports = router;
