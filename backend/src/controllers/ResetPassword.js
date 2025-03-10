const Admin = require("../models/Admin");
const Medecin = require("../models/Medecin");
const Patient = require("../models/Patient");
const jwt = require("jsonwebtoken");

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "Mot de passe requis" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await Admin.findById(decoded.id) || 
               await Medecin.findById(decoded.id) || 
               await Patient.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    // Directly assign the new password without hashing
    user.password = newPassword;
    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    res.status(500).json({ message: "Lien expiré ou invalide" });
  }
};
