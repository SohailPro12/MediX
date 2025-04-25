const jwt = require("jsonwebtoken");
const Patient = require("../../models/Patient"); 
exports.verifyPatient = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Décoder le JWT
    const patient = await Patient.findById(decoded.id);

    if (!patient) {
      return res.status(404).send("Patient introuvable");
    }

    if (patient.verifie) {
      return res.status(400).send("Le compte a déjà été vérifié");
    }

    patient.verifie = true; // Met à jour le statut de vérification
    await patient.save();

    res.status(200).send("Votre compte a été vérifié avec succès !");
  } catch (error) {
    res.status(400).send("Lien de vérification invalide ou expiré");
  }
};
