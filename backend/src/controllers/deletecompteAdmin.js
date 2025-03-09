const Admin = require("../models/Admin");

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; // Récupérer l'ID de l'utilisateur à partir du JWT
    console.log("ID utilisateur:", userId);
    
    // Supprimer l'utilisateur de la base de données
    const result = await Admin.findByIdAndDelete(userId);
    if (!result) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Compte supprimé avec succès !" });
  } catch (error) {
    console.error("Erreur suppression compte:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};