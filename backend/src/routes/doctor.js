const express = require("express");
const authMiddleware = require("../middleware/auth"); // Middleware d'authentification
const multer = require('multer');
const fs = require('fs');
const { uploadDoctorImage } = require('../controllers/doctor/uploadImage');
// Controllers
const { getProfileDoctor } = require("../controllers/doctor/dashBoardProfile");
const { EditProfile } = require("../controllers/doctor/EditProfile");
const { addPatient } = require("../controllers/doctor/AddPatient");
const { verifyPatient } = require("../controllers/doctor/VerifieNewPatient");
const { getAppointments } = require("../controllers/doctor/getAppointment");
const { getPatientsByDoctor, getPatientsByTreatingDoctor } = require("../controllers/doctor/patients");
const { confirmerAppointment } = require("../controllers/doctor/ConfirmAppo");
const { rescheduleAppointment } = require("../controllers/doctor/RescheduleAppo");
const doctorController = require("../controllers/doctor/rendezVousController");
const { addOrdonnance, deleteOrdonnance, getOrdonnanceById, updateOrdonnance } = require("../controllers/doctor/AddOrdan");
const { getOrdonnances } = require("../controllers/doctor/getOrd");
const { getPatientDossier } = require("../controllers/doctor/GetDossier");

// Models
const Problem = require("../models/Problem"); // Assurez-vous que le chemin est correct

const router = express.Router();
// Multer setup (same as your admin)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });
// Middleware for logging
router.use((req, res, next) => {
  console.log(`Doctor route hit: ${req.method} ${req.path}`);
  next();
});

// Profile routes
router.get("/profile", authMiddleware, getProfileDoctor);
router.patch("/EditProfile", authMiddleware, EditProfile);

// Patient routes
router.post("/AddPatient", addPatient);
router.get("/verifyPat/:token", verifyPatient);
router.get("/patients", getPatientsByDoctor);
router.get("/patients/treating", getPatientsByTreatingDoctor);

// Appointment routes
router.post("/appointments", getAppointments);
router.get("/appointments", authMiddleware, doctorController.getAppointments);
router.get("/appointments/:id", authMiddleware, doctorController.getAppointmentById);
router.put("/confirm/:id", confirmerAppointment);
router.put("/reschedule", rescheduleAppointment);

// Ordonnance routes
router.post("/ordonnances", authMiddleware, addOrdonnance);
router.get("/ordonnances", authMiddleware, getOrdonnances);
router.get("/ordonnances/:id", authMiddleware, getOrdonnanceById);
router.put("/ordonnances/:id", authMiddleware, updateOrdonnance);
router.delete("/ordonnances/:id", authMiddleware, deleteOrdonnance);

// Dossier routes
router.get("/dossiers/:patientId", authMiddleware, getPatientDossier);

// Problem reporting route
router.post("/report", async (req, res) => {
  try {
    const { name, role, message } = req.body;

    if (!name || !role || !message) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const problem = new Problem({ name, role, message });
    await problem.save();

    res.status(201).json({ success: true, problem });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// POST /api/doctor/uploadimage/doctor
router.post(
  '/uploadimage/doctor',
  authMiddleware,
  upload.single('image'),
  uploadDoctorImage
);
module.exports = router;
