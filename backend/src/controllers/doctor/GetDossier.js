
const DossierMedical= require("../../models/Dossier_medical");
exports.getPatientDossier = async (req, res) => {
  const { patientId } = req.params;
  const dossier = await DossierMedical.findOne({ PatientId: patientId })
  .populate('analyses')
  .populate('traitemant')
  .populate({
    path: 'ordonnances',
    populate: [
      { path: 'analyses' },
      { path: 'traitement' },
      { path: 'RendezVousId' } // 🔴 ajoute cette ligne !
    ]
  });

  if (!dossier) return res.status(404).json({ message: 'Dossier introuvable' });
  res.json(dossier);
};