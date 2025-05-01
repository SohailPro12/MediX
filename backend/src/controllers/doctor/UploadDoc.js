const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Medecin = require("../models/Medecin");

const uploadDoctorImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucune image envoyée." });
  }

  try {
    const medecinId = req.user.id;
    const medecin = await Medecin.findById(medecinId);
    if (!medecin) return res.status(404).json({ error: "Médecin introuvable." });

    const folderPath = `medix/Medecins/${medecin.code_SSO}`;
    const fileName = `${medecin.nom}-${Date.now()}`;

    // Supprimer l'ancienne image (optionnel)
    if (medecin.Photo && medecin.Photo.includes("cloudinary")) {
      const publicId = medecin.Photo.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`${folderPath}/${publicId}`);
    }

    // Upload la nouvelle image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderPath,
      public_id: fileName,
      overwrite: true,
    });

    fs.unlinkSync(req.file.path);
    medecin.Photo = result.secure_url;
    await medecin.save();

    res.json({ message: "Image mise à jour", imageUrl: result.secure_url });
  } catch (error) {
    console.error("Erreur upload image médecin :", error);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};

module.exports = { uploadDoctorImage };
