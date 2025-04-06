const jwt = require("jsonwebtoken");
const Medecin = require("../models/Medecin");

exports.verifyDoctor = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Décoder le JWT
    const doctor = await Medecin.findById(decoded.id);

    if (!doctor) {
      return res.status(404).send("Médecin introuvable");
    }

    if (doctor.verifie) {
      return res.status(400).send("Le compte a déjà été vérifié");
    }

    doctor.verifie = true; // Met à jour le statut de vérification
    await doctor.save();

    res.status(200).send("Votre compte a été vérifié avec succès !");
  } catch (error) {
    res.status(400).send("Lien de vérification invalide ou expiré");
  }
};
