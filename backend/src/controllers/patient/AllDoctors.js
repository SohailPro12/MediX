const Medecin = require("../../models/Medecin"); 
const mongoose = require("mongoose");

exports.getAllMedecin = async (req, res) => {
        console.log("Code SSO reçu:");

  const { sso } = req.params;
      console.log("Code SSO reçu:", sso);

  try {
    console.log("Code SSO reçu:", sso);

    const medecins = await Medecin.find({ code_SSO: sso });

    if (!medecins || medecins.length === 0) {
      return res.status(404).json({ message: "Aucun médecin trouvé avec ce SSO" });
    }

    res.json(medecins);
  } catch (error) {
    console.error("Erreur lors de la récupération des médecins:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
