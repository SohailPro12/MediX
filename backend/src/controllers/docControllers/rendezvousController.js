// controllers/rendezvousController.js
const RendezVous = require('../../models/Rendez-vous'); // Modèle de rendez-vous

exports.getUpcomingByMedecin = async (req, res) => {
  const { medecinId } = req.params;
  const now = new Date();

  try {
    const rdvs = await RendezVous.find({
      MedecinId: medecinId,
      date: { $gte: now }
    }).populate('PatientId');
    res.json(rdvs);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des RDV." });
  }
};
