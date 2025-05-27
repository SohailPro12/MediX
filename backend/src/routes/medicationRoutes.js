const express = require('express');
const auth    = require('../middleware/auth');
const ctl     = require('../controllers/patient/medicationController');

const router = express.Router();

// GET /api/medications/plan
router.get('/plan', auth, ctl.getPlan);

module.exports = router;
