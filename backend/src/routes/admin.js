const express = require("express");
const { addMedecin } = require("../controllers/AddMedcin");
const { verifyDoctor } = require("../controllers/VerifieNewDoctor");
const { getStatistics } = require ("../controllers/Admin_stats");
const { getMedecins } = require("../controllers/ListeMedecins");
const { deleteAccountMed } = require("../controllers/deleteMedecin");
const { getInfoMedecin } = require("../controllers/DoctorProfile");
const consultationController = require('../controllers/AdminControllers');
const router = express.Router();

router.post("/addDoc", addMedecin);
router.get("/verifyDoc/:token", verifyDoctor);
router.get("/stats", getStatistics);
router.get("/Medecins", getMedecins);
router.delete("/deleteMedecin/:id",deleteAccountMed);
router.get("/DoctorProfile/:id", getInfoMedecin);

// Debug middleware
router.use((req, res, next) => {
  console.log(`Admin route hit: ${req.method} ${req.path}`);
  next();
});

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

// routes/admin.js
router.post('/profile/picture', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    console.log('Request user:', req.user);
    const admin = await Admin.findById(req.user.id);
    console.log('Admin found:', admin ? admin.toObject() : null);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    console.log('Current image type:', typeof admin.image, admin.image instanceof Buffer ? 'Buffer' : 'String');
    console.log('File received:', req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    admin.image = req.file.buffer;
    console.log('New image type:', typeof admin.image, 'Length:', admin.image.length);

    await admin.save();
    console.log('Admin updated:', admin.toObject());

    res.json({ message: 'Profile picture updated successfully' });
  } catch (error) {
    console.error('Error updating profile picture:', error.stack); // Log full stack trace
    res.status(500).json({ message: 'Server error', error: error.message }); // Ensure error.message is sent
  }
});


module.exports = router;