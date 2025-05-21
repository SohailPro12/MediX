const Analyse = require("../../models/Analyse");
const Traitement = require("../../models/Traitement");
const Ordonnance = require("../../models/Ordonnance");
const RendezVous = require("../../models/Rendez-vous");

const DossierMedical= require("../../models/Dossier_medical");
const mongoose = require("mongoose");

exports.addOrdonnance = async (req, res) => {
  try {
    const {
      appointmentId,
      natureMaladie,
      date,
      medicaments,
      analyses: frontAnalyses = [],
      traitement: frontTraitement
    } = req.body;

    // ▶️ 1. Determine the patientId
    let patientId = req.body.PatientId;
    if (appointmentId) {
      const rdv = await RendezVous.findById(appointmentId);
      if (!rdv) return res.status(404).json({ message: "Rendez‑vous introuvable" });
      patientId = rdv.PatientId;
    }
    if (!patientId) {
      return res.status(400).json({ message: "PatientId est requis" });
    }
    if (!natureMaladie || !date) {
      return res.status(400).json({ message: "natureMaladie et date sont obligatoires" });
    }

    // ▶️ 2. Create Analyses
    let createdAnalyses = [];
    if (frontAnalyses.length) {
      const toInsert = frontAnalyses.map(a => ({
        id:          new mongoose.Types.ObjectId().toString(),
        PatientId:   patientId,
        date:        a.date,
        laboratoire: a.laboratoire,
        observation: a.observation,
        pdfs:        a.pdfs,
      }));
      createdAnalyses = await Analyse.insertMany(toInsert);
    }

    // ▶️ 3. Create Traitement
    let createdTraitement = null;
    if (frontTraitement && frontTraitement.dateDebut) {
      createdTraitement = await Traitement.create({
        PatientId:   patientId,
        dateDebut:   frontTraitement.dateDebut,
        dateFin:     frontTraitement.dateFin,
        medicaments: (frontTraitement.medicaments || []).map(m => ({
  nom: m.nom,
  dosage: m.dosage,
  endDate: m.endDate,
  periods: m.periods || []
})),
        observation: frontTraitement.observation,
      });
    }

    // ▶️ 4. Create the Ordonnance
    const ordonnance = new Ordonnance({
      PatientId:    patientId,
      MedecinId:    req.user.id,
      natureMaladie,
      date:         new Date(date),
      analyses:     createdAnalyses.map(a => a._id),
      traitement:   createdTraitement ? createdTraitement._id : undefined,
      RendezVousId: appointmentId,
    });
    await ordonnance.save();

    // ▶️ 5. Link it back into the RendezVous
    if (appointmentId) {
      await RendezVous.findByIdAndUpdate(appointmentId, {
        ordonnance: ordonnance._id
      });
    }

    // ▶️ 6. Update (or create) the Dossier Médical
    let dossier = await DossierMedical.findOne({ PatientId: patientId });
    if (!dossier) {
      dossier = await DossierMedical.create({
        numero:           Math.random().toString(36).substr(2, 9),
        PatientId:        patientId,
        dateCreation:     new Date(),
        dateModification: new Date(),
        analyses:         createdAnalyses.map(a => a._id),
        traitemant:       createdTraitement ? [createdTraitement._id] : [],
        ordonnances:      [ordonnance._id],
      });
    } else {
      dossier.analyses    = dossier.analyses    || [];
      dossier.traitemant  = dossier.traitemant  || [];
      dossier.ordonnances = dossier.ordonnances || [];

      dossier.analyses.push(...createdAnalyses.map(a => a._id));
      if (createdTraitement) dossier.traitemant.push(createdTraitement._id);
      dossier.ordonnances.push(ordonnance._id);
      dossier.dateModification = new Date();
      await dossier.save();
    }

    res.status(201).json({
      message:      "Ordonnance créée, RDV & Dossier mis à jour",
      ordonnanceId: ordonnance._id
    });

  } catch (error) {
    console.error("❌ Erreur création ordonnance :", error);
    res.status(500).json({ message: "Erreur interne lors de la création de l'ordonnance" });
  }
};




exports.getOrdonnanceById = async (req, res) => {
  try {
    const o = await Ordonnance.findById(req.params.id)
      .populate("analyses")
      .populate("traitement")
      .populate("PatientId", "nom prenom");   // <- Ajouté !
    if (!o) return res.status(404).json({ message: "Non trouvée" });
    res.json(o);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updateOrdonnance = async (req, res) => {
  try {
    const { natureMaladie, date, traitement, analyses } = req.body;
    const { id } = req.params;

    // 1. Mettre à jour le traitement existant
    const ord = await Ordonnance.findById(id);
    if (!ord) return res.status(404).json({ message: "Non trouvée" });

    // Update traitement doc
    await Traitement.findByIdAndUpdate(ord.traitement, {
      dateDebut: traitement.dateDebut,
      dateFin:   traitement.dateFin,
      observation: traitement.observation,
      medicaments: traitement.medicaments,
    });

    // Delete old analyses puis recréer
    await Analyse.deleteMany({ _id: { $in: ord.analyses } });
    const newAnalyses = await Promise.all(
      analyses.map(a => Analyse.create({
        id: new mongoose.Types.ObjectId(),
        PatientId: ord.PatientId,
        date: a.date,
        laboratoire: a.laboratoire,
        observation: a.observation,
        pdfs: a.pdfs,
      }))
    );

    // 2. Mettre à jour l’ordonnance elle‑même
    ord.natureMaladie = natureMaladie;
    ord.date          = date;
    ord.analyses      = newAnalyses.map(a => a._id);
    await ord.save();

    res.json({ message: "Ordonnance modifiée avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.deleteOrdonnance = async (req, res) => {
  try {
    const { id } = req.params;
    const ord = await Ordonnance.findById(id);
    if (!ord) return res.status(404).json({ message: "Ordonnance non trouvée" });

    // Supprimer traitement s'il existe
    if (ord.traitement) {
      await Traitement.findByIdAndDelete(ord.traitement);
    }

    // Supprimer analyses associées
    if (ord.analyses?.length) {
      await Analyse.deleteMany({ _id: { $in: ord.analyses } });
    }

    // Supprimer l’ordonnance elle-même
    await Ordonnance.findByIdAndDelete(id);

    // Retirer références du dossier médical
    await DossierMedical.updateOne(
      { PatientId: ord.PatientId },
      {
        $pull: {
          ordonnances: ord._id,
          traitemant: ord.traitement,
          analyses: { $in: ord.analyses }
        },
        $set: { dateModification: new Date() }
      }
    );

    res.json({ message: "Ordonnance et ses données associées supprimées" });
  } catch (err) {
    console.error("Erreur deleteOrdonnance:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
