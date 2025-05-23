const mongoose = require("mongoose");
const Appointment = require("../../models/Rendez-vous");

exports.getAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) {
      return res.status(400).json({ error: "patientId est requis" });
    }

    const appointments = await Appointment.find({ PatientId: patientId })
      .populate("MedecinId", "nom prenom specialite lieu motif observation rating status Photo") // ajoute plus d'infos utiles
      .sort({ date: 1}); // trie par date 
      // console.log("CCCC",appointments )
      const formattedAppointments = appointments.map((appt) => {
      const dateObj = new Date(appt.date);
      const dateFormatted = dateObj.toLocaleDateString('fr-FR');
      const timeFormatted = dateObj.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });

  return {
    id: appt._id,
    date: dateFormatted,
    time: timeFormatted,
    name: `${appt.MedecinId.prenom} ${appt.MedecinId.nom}`,
    Image: `${appt.MedecinId.Photo}`,
    specialty: appt.MedecinId.specialite,
    lieu: appt.lieu,
    motif: appt.motif,
    observation: appt.observation,
    rating: appt.rating,
    status: appt.status,
    ordonnance: appt.ordonnance
    
  };
});


    res.json(formattedAppointments);
  } catch (error) {
    console.error("Erreur lors du chargement des rendez-vous:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
