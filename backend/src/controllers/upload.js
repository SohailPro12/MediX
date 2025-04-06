const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucune image envoyée." });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "medix/doctors",
      public_id: `${Date.now()}-${req.file.originalname}`,
    });

    console.log("✅ Upload réussi :", result.secure_url);

    fs.unlinkSync(req.file.path); // Supprime le fichier temporaire après upload

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("❌ Erreur Cloudinary :", error);
    res.status(500).json({ error: "Erreur Cloudinary", details: error });
  }
};

module.exports = { uploadImage };
