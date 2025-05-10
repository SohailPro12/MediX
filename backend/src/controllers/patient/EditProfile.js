const Patient = require("../../models/Patient");
const bcrypt = require('bcryptjs');

exports.EditProfile = async (req, res) => {
  try {
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      return res.status(404).json({ message: "Patient non trouvé" });
    }

    const { nom, prenom, email, password, newPassword, photo } = req.body;

    // Vérification du mot de passe actuel si changement de mot de passe
    if (newPassword) {
      if (!password) {
        return res.status(400).json({ message: "L'ancien mot de passe est requis" });
      }
      
      const isMatch = await bcrypt.compare(password, patient.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mot de passe actuel incorrect" });
      }

    }

    if (nom) patient.nom = nom;
    if (prenom) patient.prenom = prenom;
    if (email) patient.mail = email;
    if (photo) patient.Photo = photo;

    await patient.save();

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      patient: {
        nom: patient.nom,
        prenom: patient.prenom,
        mail: patient.mail,
        Photo: patient.Photo
        // Ne pas renvoyer le mot de passe
      }
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil patient :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};