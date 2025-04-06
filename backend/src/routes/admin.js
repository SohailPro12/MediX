const express = require("express");
const { addMedecin } = require("../controllers/AddMedcin");
const { verifyDoctor } = require("../controllers/VerifieNewDoctor");
const { getStatistics } = require ("../controllers/Admin_stats");
const { getMedecins } = require("../controllers/ListeMedecins");
const { deleteAccountMed } = require("../controllers/deleteMedecin");
const { getInfoMedecin } = require("../controllers/DoctorProfile");

const router = express.Router();

router.post("/addDoc", addMedecin);
router.get("/verifyDoc/:token", verifyDoctor);
router.get("/stats", getStatistics);
router.get("/Medecins", getMedecins);
router.delete("/deleteMedecin/:id",deleteAccountMed);
router.get("/DoctorProfile/:id", getInfoMedecin);

module.exports = router;
