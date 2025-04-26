const mongoose = require("mongoose");
const Appointment = require("../../models/Rendez-vous");
const Patient = require("../../models/Patient");  

exports.getPatientsByDoctor = async (req, res) => {
  try {
    const { medecinId } = req.query;

    if (!medecinId) {
      return res.status(400).json({ error: "medecinId est requis" });
    }

    const appointments = await Appointment.find({
      MedecinId: medecinId,
      status: "confirmed", 
    }).populate("PatientId", "nom prenom mail telephone ");  

    const patients = appointments.map((appointment) => appointment.PatientId);

    // S'assurer qu'on retourne uniquement les patients uniques
    const uniquePatients = [...new Set(patients.map(patient => patient._id.toString()))];

    const patientDetails = await Patient.find({
      _id: { $in: uniquePatients }
    });

    res.json(patientDetails);  
  } catch (error) {
    console.error("Erreur lors de la récupération des patients:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
