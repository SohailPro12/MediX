const Medecin = require("../models/Medecin");
const cloudinary = require("../config/cloudinary");

exports.deleteAccountMed = async (req, res) => {
  const { id } = req.params;

  try {
    console.log("ID utilisateur:", id);

    // 🔍 Rechercher le médecin
    const medecin = await Medecin.findById(id);
    if (!medecin) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // 🧹 Supprimer l'image de Cloudinary si elle existe
    if (medecin.image && medecin.image.includes("cloudinary")) {
      const parts = medecin.image.split("/");
      const fileName = parts[parts.length - 1].split(".")[0]; // nom sans extension
      await cloudinary.uploader.destroy(`medix/doctors/${fileName}`);
      console.log("✅ Image supprimée de Cloudinary:", fileName);
    }

    // 🗑️ Supprimer le médecin de la base
    await Medecin.findByIdAndDelete(id);

    res.json({ message: "Compte supprimé avec succès !" });
  } catch (error) {
    console.error("❌ Erreur suppression compte:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
