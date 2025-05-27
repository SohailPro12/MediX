const express = require("express");
const authMiddleware = require("../middleware/auth"); // Middleware d'authentification
const multer = require('multer');
const fs = require('fs');
// Controllers
const { getProfilePatient } = require("../controllers/patient/getProfile");
const { EditProfile } = require("../controllers/patient/EditProfile");
const { getAppointments } = require("../controllers/patient/getAppointement");
const { rateAppointment } = require("../controllers/patient/rateAppointement");
const { getAllDoctorsOfPatient } = require("../controllers/patient/docteur");
const { getAllMedecin } = require("../controllers/patient/AllDoctors");
const { PostAppointment } = require("../controllers/patient/Post_Appointement");
const router = express.Router();
// Profile routes
router.get("/profile", authMiddleware, getProfilePatient );
router.patch("/EditProfile", authMiddleware, EditProfile);
router.get("/getAppointments/:patientId", getAppointments);
router.post("/rateAppointment", rateAppointment);
router.get("/getDocteurs/:patientId", getAllDoctorsOfPatient);
router.get("/getAllMedecins/:sso", getAllMedecin);
router.post("/PostAppointment", PostAppointment);






module.exports = router;
