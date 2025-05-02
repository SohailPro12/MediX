const express = require("express");
const authMiddleware = require("../middleware/auth"); // Middleware d'authentification
const { getProfileDoctor } = require("../controllers/doctor/dashBoardProfile");
const { EditProfile } = require("../controllers/doctor/EditProfile");
const { addPatient } = require("../controllers/doctor/AddPatient");
const { verifyPatient } = require("../controllers/doctor/VerifieNewPatient");
const { getAppointments } = require("../controllers/doctor/getAppointment");
const { getPatientsByDoctor } = require("../controllers/doctor/patients");

const doctorController = require("../controllers/doctor/rendezVousController"); 
const { addOrdonnance } = require("../controllers/doctor/AddOrdan");
const { getOrdonnances } = require("../controllers/doctor/getOrd");
const { getPatientDossier } = require('../controllers/doctor/GetDossier');



const router = express.Router();

router.use((req, res, next) => {
  console.log(`Doctor route hit: ${req.method} ${req.path}`);
  next();
});
router.get("/profile", authMiddleware, getProfileDoctor);
router.patch('/EditProfile', authMiddleware, EditProfile);
router.post('/AddPatient', addPatient);
router.get("/verifyPat/:token", verifyPatient);
router.post('/appointments', getAppointments);
router.get('/patients', getPatientsByDoctor);


router.get("/appointments", authMiddleware, doctorController.getAppointments);
router.get('/appointments/:id', authMiddleware, doctorController.getAppointmentById);
router.post("/ordonnances", authMiddleware, addOrdonnance);
router.get("/ordonnances", authMiddleware, getOrdonnances);
router.get('/dossiers/:patientId', authMiddleware, getPatientDossier);

module.exports = router;
