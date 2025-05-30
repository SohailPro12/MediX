const mongoose = require("mongoose");
const Appointment = require("../../models/Rendez-vous");
const Patient = require("../../models/Patient");

exports.getAllDoctorsOfPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) {
      return res.status(400).json({ error: "patientId est requis" });
    }

    // 1. Médecins via le champ `id_medecins`
    const patient = await Patient.findById(patientId).populate(
      "id_medecin",
      "nom prenom Photo specialite formation experience telephone mail description"
    );
        const medecinsFromField = patient?.id_medecin
      ? [patient.id_medecin] // transforme en tableau s'il existe
      : [];

    // 2. Médecins via les rendez-vous confirmés
    const appointments = await Appointment.find({
      PatientId: patientId,
      status: "confirmed",
    }).populate("MedecinId", "nom prenom photo specialite formation experience telephone mail description");

    const medecinsFromAppointments = appointments.map((a) => a.MedecinId);

    // 3. Fusionner les deux listes sans doublons
    const medecinMap = new Map();

    [...medecinsFromField, ...medecinsFromAppointments].forEach((med) => {
      if (med && med._id) {
        medecinMap.set(med._id.toString(), med);
      }
    });

    const uniqueMedecins = Array.from(medecinMap.values());

    res.json(uniqueMedecins);
  } catch (error) {
    console.error("Erreur lors de la récupération des médecins :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
