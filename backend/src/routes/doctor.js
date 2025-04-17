const express = require("express");
const authMiddleware = require("../middleware/auth"); // Middleware d'authentification
const { getProfileDoctor } = require("../controllers/doctor/dashBoardProfile");


const router = express.Router();
router.get('/profile', authMiddleware, getProfileDoctor);


module.exports = router;
