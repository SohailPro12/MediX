// controllers/doctorController.js
const RendezVous = require("../../models/Rendez-vous");

const mongoose = require("mongoose");

exports.getAppointments = async (req, res) => {
  try {
    const medecinId = req.user.id; // depuis le token JWT
    const startDate = new Date(req.query.start);
    const endDate = new Date(req.query.end);

    // Logs de débogage
    console.log("Doctor ID:", medecinId);
    console.log("Searching between:", startDate, "and", endDate);

    const appointments = await RendezVous.find({
      MedecinId: medecinId,
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("PatientId", "nom prenom") // optionnel
      .sort({ date: 1 });

    console.log("Appointments retrieved:", appointments);
    res.status(200).json(appointments);
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    res
      .status(500)
      .json({
        message: "Erreur serveur lors de la récupération des rendez-vous.",
      });
  }
};
