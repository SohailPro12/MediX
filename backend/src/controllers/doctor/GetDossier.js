const DossierMedical = require('../../models/Dossier_medical');

exports.getPatientDossier = async (req, res) => {
    try {
      const { patientId } = req.params;
      console.log("patientId:", patientId); // Debugging line to check the patientId value
      
      const dossier = await DossierMedical.findOne({ PatientId: patientId })
        .populate('analyses')
        .populate('traitemant');
      console.log("dossier:", dossier); // Debugging line to check the dossier value
      if (!dossier) return res.status(404).json({ message: 'Dossier introuvable' });
  
      res.json(dossier);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erreur récupération dossier' });
    }
  };