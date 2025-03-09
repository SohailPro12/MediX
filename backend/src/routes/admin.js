const express = require("express");
const { addMedcine } = require("../controllers/AddMedcin");
const { verifieDoctor } = require("../controllers/VerifieNewDoctor");

const router = express.Router();

router.post("/add-medcine", addMedcine);
router.get('/verifie-doctor', verifieDoctor);

module.exports = router;