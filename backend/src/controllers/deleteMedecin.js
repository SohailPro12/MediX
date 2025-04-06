const Medecin = require("../models/Medecin");

exports.deleteAccountMed = async (req, res) => {
    const { id } = req.params;
  try {
     
    console.log("ID utilisateur:", id);
    
    // Supprimer l'utilisateur de la base de données
    const result = await Medecin.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Compte supprimé avec succès !" });
  } catch (error) {
    console.error("Erreur suppression compte:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};