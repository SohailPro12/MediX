const Ordonnance = require("../../models/Ordonnance");
exports.getPatientDossier = async (req, res) => {
  try {
    const { patientId } = req.params;
    // Find all ordonnances for this patient:
    const list = await Ordonnance.find({ PatientId: patientId })
      .populate("analyses")
      .populate("traitement")
      .populate("MedecinId", "nom prenom")
      .populate("RendezVousId", "date");  // pull in the RDV date
    return res.json(list);
  } catch (err) {
    console.error("Erreur getPatientDossier:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};