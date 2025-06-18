const express = require("express");
const authMiddleware = require("../middleware/auth"); // Middleware d'authentification
const multer = require('multer');
const fs = require('fs');

// Multer configuration for file uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Controllers
const { getProfilePatient } = require("../controllers/patient/getProfile");
const { EditProfile } = require("../controllers/patient/EditProfile");
const { getAppointments } = require("../controllers/patient/getAppointement");
const { rateAppointment } = require("../controllers/patient/rateAppointement");
const { getAllDoctorsOfPatient } = require("../controllers/patient/docteur");
const { getAllMedecin } = require("../controllers/patient/AllDoctors");
const { PostAppointment } = require("../controllers/patient/Post_Appointement");
const { uploadPatientImage } = require("../controllers/patient/uploadImage");
const router = express.Router();
// Profile routes
router.get("/profile", authMiddleware, getProfilePatient );
router.patch("/EditProfile", authMiddleware, EditProfile);
router.get("/getAppointments/:patientId", getAppointments);
router.post("/rateAppointment", rateAppointment);
router.get("/getDocteurs/:patientId", getAllDoctorsOfPatient);
router.get("/getAllMedecins/:sso", getAllMedecin);
router.post("/PostAppointment", PostAppointment);

// Image upload route
// POST /api/patient/uploadimage
router.post(
  "/uploadimage",
  authMiddleware,
  upload.single('image'),
  uploadPatientImage
);

module.exports = router;
