const mongoose = require("mongoose");
const Appointment = require("../../models/Rendez-vous");
const Patient = require("../../models/Patient");  


exports.getPatientsByDoctor = async (req, res) => {
  try {
    const { medecinId } = req.query;

    if (!medecinId) {
      return res.status(400).json({ error: "medecinId est requis" });
    }

    const today = new Date();

    // Récupérer tous les rendez-vous confirmés du médecin
    const appointments = await Appointment.find({
      MedecinId: medecinId,
      status: "confirmed",
    }).populate("PatientId", "nom prenom mail telephone photo cin adresse");

    const patientMap = new Map();

    appointments.forEach((appointment) => {
      const patient = appointment.PatientId;
      const patientId = patient._id.toString();
      const appointmentDate = new Date(appointment.date);

      if (!patientMap.has(patientId)) {
        patientMap.set(patientId, {
          ...patient.toObject(),
          lastConfirmedAppointment: null,
          rawDate: null,
        });
      }

      const entry = patientMap.get(patientId);

      // Enregistrer uniquement la date du dernier rendez-vous passé ou actuel
      if (appointmentDate <= today) {
        if (!entry.rawDate || appointmentDate > new Date(entry.rawDate)) {
          entry.lastConfirmedAppointment = appointmentDate.toLocaleDateString("fr-FR");
          entry.rawDate = appointment.date;
        }
      }
    });

    const patientsList = Array.from(patientMap.values()).map(({ rawDate, ...rest }) => rest);

    res.json(patientsList);
  } catch (error) {
    console.error("Erreur lors de la récupération des patients:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


exports.getPatientsByTreatingDoctor = async (req, res) => {
  try {    
    const {medecinId} = req.query;

    if (!medecinId) {
      return res.status(400).json({ error: "id_medecin est requis" });
    }

    const patients = await Patient.find({
      id_medecin: medecinId,
    }).select("nom prenom mail telephone photo");

    res.json(patients);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};