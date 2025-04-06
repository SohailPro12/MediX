const Medecin = require("../models/Medecin"); 
const mongoose = require("mongoose");

exports.getMedecins = async (req, res) => {
    const {ssoCode}= req.body;
    try {
        const Doctors=await Medecin.find({ ssoCode });

        res.json({
        Doctors,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des Médecin :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
