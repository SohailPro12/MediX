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
const dossierCtrl = require("../controllers/patient/dossierController");
const {uploadProfilePicture} = require("../controllers/patient/uploadProfilePicture");


const router = express.Router();
// Profile routes
router.get("/profile", authMiddleware, getProfilePatient );
router.patch("/EditProfile", authMiddleware, EditProfile);
router.post("/getAppointments", getAppointments);
router.post("/rateAppointment", rateAppointment);
router.get("/getDocteurs", getAllDoctorsOfPatient);



// GET /api/patient/dossiers/:patientId
router.get("/dossiers/:patientId", authMiddleware, dossierCtrl.getPatientDossier);









// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/patients';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Route: POST /api/patient/uploadimage
router.post(
  "/uploadimage",
  authMiddleware,
  upload.single("image"),
  uploadProfilePicture
);




module.exports = router;
