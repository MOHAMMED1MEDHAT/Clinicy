const search = require("../controller/searchController");
const router = require("express").Router();

router.get("/specialization", search.searchUsingSpecialization);

router.get("/name", search.searchUsingDoctorName);

module.exports = router;
