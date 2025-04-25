const express = require("express");
const authMiddleware = require("../middleware/auth"); // Middleware d'authentification
const { getProfileDoctor } = require("../controllers/doctor/dashBoardProfile");
const { EditProfile } = require("../controllers/doctor/EditProfile");
const { addPatient } = require("../controllers/doctor/AddPatient");
const { verifyPatient } = require("../controllers/doctor/VerifieNewPatient");
const { getAppointments } = require("../controllers/doctor/getAppointment");
const { getPatientsByDoctor } = require("../controllers/doctor/patients");



const router = express.Router();
router.get('/profile', authMiddleware, getProfileDoctor);
router.patch('/EditProfile', authMiddleware, EditProfile);
router.post('/AddPatient', addPatient);
router.get("/verifyPat/:token", verifyPatient);
router.post('/appointments', getAppointments);
router.get('/patients', getPatientsByDoctor);




module.exports = router;
