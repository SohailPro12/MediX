const Ordonnance = require("../../models/Ordonnance");
const Analyse = require("../../models/Analyse");
const Traitement = require("../../models/Traitement");
const mongoose = require("mongoose");  
exports.getOrdonnances = async (req, res) => {
    try {
      const ordos = await Ordonnance.find({ MedecinId: req.user.id })
        .populate('PatientId', 'nom prenom')
        .populate('analyses')
        .populate({
          path: 'traitement',
          populate: { path: 'medicaments' } // si tu veux peupler ses sous-docs
        });
      res.json(ordos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur récupération ordonnances' });
    }
  };