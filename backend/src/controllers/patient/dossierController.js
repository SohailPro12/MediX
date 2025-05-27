const DossierMedical = require("../../models/Dossier_medical");

exports.getPatientDossier = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Find the medical dossier for this patient
    const dossier = await DossierMedical.findOne({ PatientId: patientId })
      // populate the ordonnances array and their sub‐refs
      .populate({
        path: "ordonnances",
        populate: [
          { path: "MedecinId", select: "nom prenom Photo" },
          { path: "analyses", select: "date laboratoire observation pdfs" },
          { path: "traitement", select: "dateDebut dateFin medicaments observation" }
        ]
      })
      .lean();

    if (!dossier) {
      return res.status(404).json({ message: "Dossier médical introuvable" });
    }

    res.json(dossier);
  } catch (err) {
    console.error("Erreur getPatientDossier:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
