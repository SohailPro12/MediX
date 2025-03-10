const Medecin = require('../models/Medecin');
jwt = require('jsonwebtoken');

exports.VerifieDoctor = async (req, res) => {
    const token = req.query.token;
  
    if (!token) {
      return res.status(400).send('Token de vérification manquant');
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const doctor = await Medecin.findById(decoded.id);
  
      if (!doctor) {
        return res.status(400).send('Médecin non trouvé');
      }
  
      doctor.verifie = true;
      await doctor.save();
  
      res.send('Email vérifié avec succès');
    } catch (error) {
      res.status(500).send('Erreur serveur');
    }
  };
  