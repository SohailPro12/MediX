const fs = require("fs");
const cloudinary = require("../../config/cloudinary");
const Patient = require("../../models/Patient");


exports.uploadProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucune image envoyée." });
  }

  try {
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ error: "Patient introuvable." });

    // Détruire l'ancienne image Cloudinary si présente
    if (patient.photo && patient.photo.includes('cloudinary')) {
      const match = patient.photo.match(/\/([^\/]+)\.[a-zA-Z]+$/);
      if (match?.[1]) {
        await cloudinary.uploader.destroy(`medix/Patients/${match[1]}`);
      }
    }

    // Uploader vers Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `medix/Patients`,
      public_id: `${patient.nom}-${patient._id}`,
      overwrite: true,
    });

    // Supprimer fichier temporaire
    fs.unlinkSync(req.file.path);

    // Sauvegarde dans la BDD
    patient.photo = result.secure_url;
    await patient.save();

    res.json({ message: "Image mise à jour", url: result.secure_url });
  } catch (error) {
    console.error("Erreur upload patient image:", error);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};
