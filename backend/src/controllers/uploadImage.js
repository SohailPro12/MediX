const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const Admin = require("../models/Admin");

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucune image envoyée." });
  }

  try {
    const adminId = req.user.id;
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ error: "Admin introuvable." });

    const folderPath = `medix/Admins/${admin.code_SSO}`;
    const fileName = `${admin.nom}-${Date.now()}`;

    // Supprimer l'ancienne image (optionnel)
    if (admin.image && admin.image.includes("cloudinary")) {
      const publicId = admin.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`${folderPath}/${publicId}`);
    }

    // Upload la nouvelle image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderPath,
      public_id: fileName,
      overwrite: true,
    });

    fs.unlinkSync(req.file.path);
    admin.image = result.secure_url;
    await admin.save();

    res.json({ message: "Image mise à jour", imageUrl: result.secure_url });
  } catch (error) {
    console.error("Erreur upload image :", error);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};

module.exports = { uploadImage };
