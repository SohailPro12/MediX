const mongoose = require("mongoose");
const Appointment = require("../../models/Rendez-vous");

exports.confirmerAppointment = async (req, res) => {
  try {
    // Récupérer l'ID du rendez-vous depuis les paramètres de l'URL
    const { id } = req.params;  // Correction ici : req.param => req.params
    console.log("ID du rendez-vous à confirmer:", id);

    // Vérification de la validité de l'ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID de rendez-vous invalide" });
    }

    // Mettre à jour le rendez-vous
    const RDV = await Appointment.findByIdAndUpdate(
      id,
      { status: "confirmed" },  // On confirme ici
      { new: true }  // Pour retourner le rendez-vous mis à jour
    );

    // Si le rendez-vous n'existe pas
    if (!RDV) {
      return res.status(404).json({ error: "Rendez-vous non trouvé" });
    }

    // Retourner la réponse
    res.status(200).json(RDV);
  } catch (error) {
    console.error("Erreur lors de la confirmation du rendez-vous:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
