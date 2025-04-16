const Medecin = require("../models/Medecin"); 
const mongoose = require("mongoose");

exports.getInfoMedecin = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("ID utilisateur:", id);
    
    const result = await Medecin.findById(id);
    
    if (!result) {
      return res.status(404).json({ message: "Médecin non trouvé" });
    }
    
    res.json(result);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
