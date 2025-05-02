const Analyse = require("../../models/Analyse");
const Traitement = require("../../models/Traitement");
const Ordonnance = require("../../models/Ordonnance");
const RendezVous = require("../../models/Rendez-vous");
const DossierMedical = require("../../models/Dossier_medical");
const mongoose = require("mongoose");
exports.addOrdonnance = async (req, res) => {
  try {
    const {
      appointmentId,
      PatientId: bodyPatientId,
      natureMaladie,
      date,
      medicaments,
      analyses: frontAnalyses = [],
      traitement: frontTraitement
    } = req.body;

    // 1️⃣ Déterminer le patient
    let patientId = bodyPatientId;
    if (appointmentId) {
      const rdv = await RendezVous.findById(appointmentId);
      if (!rdv) return res.status(404).json({ message: "Rendez-vous introuvable" });
      patientId = rdv.PatientId;
      console.log("patientId from appointment:", patientId); // Debugging line to check the patientId value
    }
    if (!patientId) {
      return res.status(400).json({ message: "PatientId est requis" });
    }
    if (!natureMaladie || !date) {
      return res.status(400).json({ message: "natureMaladie et date sont obligatoires" });
    }

    // 2️⃣ Créer les analyses avec un champ `id` unique
    let createdAnalyses = [];
    if (frontAnalyses.length) {
      const toInsert = frontAnalyses.map(a => ({
        id: new mongoose.Types.ObjectId().toString(), // Génère un id string unique
        PatientId: patientId,
        date: a.date,
        laboratoire: a.laboratoire,
        observation: a.observation,
        pdfs: a.pdfs,
      }));
      createdAnalyses = await Analyse.insertMany(toInsert);
    }

    // 3️⃣ Créer le traitement
    let createdTraitement = null;
    if (frontTraitement && frontTraitement.dateDebut) {
      createdTraitement = await Traitement.create({
        PatientId: patientId,
        dateDebut: frontTraitement.dateDebut,
        dateFin: frontTraitement.dateFin,
        medicaments: frontTraitement.medicaments,
        observation: frontTraitement.observation,
      });
    }

    // 4️⃣ Créer l’ordonnance
    const ordonnance = new Ordonnance({
      PatientId: patientId,
      MedecinId: req.user.id,
      natureMaladie,
      date: new Date(date),
      medicaments: Array.isArray(medicaments) ? medicaments : [],
      analyses: createdAnalyses.map(a => a._id),
      traitement: createdTraitement ? createdTraitement._id : undefined
    });
console.log("patientId:", patientId); // Debugging line to check the patientId value
await ordonnance.save();
    // 4. Mettre à jour (ou créer) Dossier Médical
let dossier = await DossierMedical.findOne({ patientId });
PatientId = patientId;
if (!dossier) {
  dossier = await DossierMedical.create({
    numero: Math.random().toString(36).substr(2, 9),
    PatientId,
    dateCreation: new Date(),
    dateModification: new Date(),
/*     consultation: [], */
    analyses: createdAnalyses.map(a => a._id),  // Utilisation de createdAnalyses ici
    traitemant: createdTraitement ? [createdTraitement._id] : [], // Utilisation de createdTraitement ici
  });
} else {
  dossier.analyses.push(...createdAnalyses.map(a => a._id));  // Ajout des analyses
  if (createdTraitement) {
    dossier.traitemant.push(createdTraitement._id);  // Ajout du traitement s'il existe
  }
  dossier.dateModification = new Date();
  await dossier.save();
}


    res.status(201).json({ message: "Ordonnance créée et Dossier médical mis à jour !" });

  } catch (error) {
    console.error("Erreur création ordonnance :", error);
    return res.status(500).json({
      message: "Erreur interne lors de la création de l'ordonnance"
    });
  }
};
