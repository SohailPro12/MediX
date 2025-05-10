const mongoose = require("mongoose");
const Appointment = require("../../models/Rendez-vous");

exports.getAppointments = async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({ error: "patientId est requis" });
    }

    const appointments = await Appointment.find({ PatientId: patientId })
      .populate("MedecinId", "nom prenom specialite") // ajoute plus d'infos utiles
      .sort({ date: 1, time: 1 }); // trie par date puis heure

    const formattedAppointments = appointments.map((appt) => ({
      id: appt._id,
      date: appt.date,
      time: appt.time,
      name: `${appt.MedecinId.prenom} ${appt.MedecinId.nom}`,
      specialty: appt.MedecinId.specialite, 
    }));

    res.json(formattedAppointments);
  } catch (error) {
    console.error("Erreur lors du chargement des rendez-vous:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
