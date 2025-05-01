const express = require("express");
const authMiddleware = require("../middleware/auth"); // Middleware d'authentification
const { getProfileDoctor } = require("../controllers/doctor/dashBoardProfile");
const { EditProfile } = require("../controllers/doctor/EditProfile");
const { addPatient } = require("../controllers/doctor/AddPatient");
const { verifyPatient } = require("../controllers/doctor/VerifieNewPatient");
const { getAppointments } = require("../controllers/doctor/getAppointment");
const { getPatientsByDoctor } = require("../controllers/doctor/patients");
const { confirmerAppointment } = require("../controllers/doctor/ConfirmAppo");
const { rescheduleAppointment } = require("../controllers/doctor/RescheduleAppo");
const { uploadDoctorImage } = require("../controllers/doctor/UploadDoc");




const router = express.Router();
router.get('/profile', authMiddleware, getProfileDoctor);
router.patch('/EditProfile', authMiddleware, EditProfile);
router.post('/AddPatient', addPatient);
router.get("/verifyPat/:token", verifyPatient);
router.post('/appointments', getAppointments);
router.get('/patients', getPatientsByDoctor);
router.put('/confirm/:id', confirmerAppointment);
router.put('/reschedule', rescheduleAppointment); 


router.post("/uploadImage", authMiddleware, upload.single("image"), uploadDoctorImage);





module.exports = router;
