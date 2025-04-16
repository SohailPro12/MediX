const Appointment = require("../models/Rendez-vous"); // Modèle de rendez-vous
const Patient = require("../models/Patient"); // Modèle de patient
const Medecin = require("../models/Medecin"); 
const mongoose = require("mongoose");

// Récupérer les statistiques principales
exports.getStatistics = async (req, res) => {
    const {ssoCode}= req.body;
    try {
        const totalPatients =  await Patient.countDocuments({ ssoCode });
        const totalDoctors=await Medecin.countDocuments({ ssoCode });
        const medecins = await Medecin.find({ ssoCode }).select("_id");
        const medecinIds = medecins.map(med => med._id);

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Obtenir la date actuelle à 23:59:59
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Nombre de rendez-vous aujourd’hui
        const appointmentsToday = await Appointment.countDocuments({
            date: { $gte: startOfDay, $lte: endOfDay },
            MedecinId: { $in: medecinIds }  // Cette condition filtre par MedecinId
        });

       

        res.json({
            totalPatients,
            appointmentsToday,
            totalDoctors,

        });
    } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
