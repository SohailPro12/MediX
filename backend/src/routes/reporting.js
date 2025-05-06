// routes/reporting.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Problem = require('../models/Problem');

// POST /api/reporting/report
router.post('/report', auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Le message est requis" });
    }

    // req.user is injected by authMiddleware from the JWT
    const { id: userId, role, code_SSO } = req.user;
console.log("User ID:", userId);
    console.log("Role:", role); 
    console.log("Code SSO:", code_SSO);
    const problem = new Problem({
      userId,
      role,
      code_sso: code_SSO,
      message
    });
    await problem.save();

    res.status(201).json({ success: true, problem });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET all problems (optionally filter by userId or role via query)
router.get('/', auth, async (req, res) => {
  try {
    // e.g. /api/reporting?solved=false
    const filter = { userId: req.user.id };
    if (req.query.solved != null) filter.solved = req.query.solved === 'true';
    const problems = await Problem.find(filter).sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    console.error("Erreur récupération :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
