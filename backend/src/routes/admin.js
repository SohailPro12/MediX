const express = require("express");
const { addMedecin } = require("../controllers/AddMedcin");
const { verifyDoctor } = require("../controllers/VerifieNewDoctor");
const { getStatistics } = require ("../controllers/Admin_stats");
const { getMedecins } = require("../controllers/ListeMedecins");
const { deleteAccountMed } = require("../controllers/deleteMedecin");
const { getInfoMedecin } = require("../controllers/DoctorProfile");
const consultationController = require('../controllers/consultationController');
const authMiddleware = require('../middleware/auth');

const Clinique = require('../models/Clinique');
const Admin = require('../models/Admin');
const multer = require('multer');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store in memory as Buffer
// Debug middleware
router.use((req, res, next) => {
  console.log(`Admin route hit: ${req.method} ${req.path}`);
  next();
});

router.post("/addDoc", addMedecin);
router.get("/verifyDoc/:token", verifyDoctor);
router.get("/stats", getStatistics);
router.get("/Medecins", getMedecins);
router.delete("/deleteMedecin/:id",deleteAccountMed);
router.get("/DoctorProfile/:id", getInfoMedecin);


// Get consultations by date
router.get('/consultations/date/:date', authMiddleware, consultationController.getConsultationsByDate);

// Get admin profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const clinique = await Clinique.findOne({ code_SSO: admin.code_SSO });
    const response = {
      ...admin.toObject(),
      cliniqueNom: clinique ? clinique.nom : 'N/A',
      image: admin.image instanceof Buffer ? admin.image.toString('base64') : admin.image
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});






module.exports = router;