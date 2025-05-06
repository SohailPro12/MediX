const mongoose = require("mongoose");
const Appointment = require("../../models/Rendez-vous");

exports.getAppointments = async (req, res) => {
  try {
    const { medecinId, status, upcomingOnly } = req.body;

    const now = new Date();
       let query = {
      MedecinId: medecinId,
      status: status,
    };

    if (upcomingOnly) {
      query.date = { $gte: now };  
    }

    const appointments = await Appointment.find(query)
      .populate("PatientId", "nom prenom")
      .sort({ date: 1 });
/* 
    console.log("appointments", appointments); */

    res.json(appointments);
  } catch (error) {
    console.error("Erreur lors du chargement des rendez-vous:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
