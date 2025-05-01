/* hadi makn7tajohach daba */

/* const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Admin = require("../models/Admin");

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucune image envoyée." });
  }

  const type = req.params.type || "general";

  try {
    const adminId = req.user.id; // Depuis ton middleware JWT
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ error: "Admin introuvable." });
    }

    const extension = req.file.originalname.split(".").pop();
    const fileName = `${admin.nom}.${extension}`;

    // Supprimer l'ancienne image si existante
    if (admin.image && admin.image.includes("cloudinary")) {
      const publicId = admin.image.split("/").pop().split(".")[0]; // ex: nom.extension -> nom
      await cloudinary.uploader.destroy(`medix/${type}/${publicId}`);
    }

    // Upload nouvelle image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `medix/${type}`,
      public_id: fileName.split(".")[0], // sans extension
      overwrite: true,
    });

    // Supprimer l'image temporaire locale
    fs.unlinkSync(req.file.path);

    // Mettre à jour l'admin avec le nouveau lien
    admin.image = result.secure_url;
    await admin.save();

    res.json({ message: "Image mise à jour avec succès", imageUrl: result.secure_url });

  } catch (error) {
    console.error("❌ Erreur Cloudinary :", error);
    res.status(500).json({ error: "Erreur Cloudinary", details: error });
  }
};

module.exports = { uploadImage };
 */