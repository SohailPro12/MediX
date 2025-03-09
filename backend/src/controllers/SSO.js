const Clinique = require("../models/Clinique");

exports.ssoLogin = async (req, res) => {
  try {
    const { sso } = req.body; 
    if (!sso) {
      return res.status(400).json({ message: "Code SSO requis" });
    }

    console.log("Tentative de connexion avec SSO:", sso);
    
    const clinique = await Clinique.findOne({ code_SSO: sso });

    if (!clinique) {
      return res.status(404).json({ message: "Clinique non trouvée" });
    }

    res.status(200).json({ message: "Connexion réussie", clinique });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
