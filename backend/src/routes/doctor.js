const express = require("express");
const authMiddleware = require("../middleware/auth"); // Middleware d'authentification
const { getProfileDoctor } = require("../controllers/doctor/dashBoardProfile");
const doctorController = require("../controllers/doctor/rendezVousController"); // Importer le contrôleur des rendez-vous

const router = express.Router();

router.use((req, res, next) => {
  console.log(`Doctor route hit: ${req.method} ${req.path}`);
  next();
});
router.get("/profile", authMiddleware, getProfileDoctor);
router.get("/appointments", authMiddleware, doctorController.getAppointments);

module.exports = router;
