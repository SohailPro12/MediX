const Medecin = require("../../models/Medecin");

exports.getProfileDoctor = async (req, res) => {
  try {
    const doctorId = req.user.id; // ID injecté par le middleware d'authentification
    console.log("ID Médecin depuis le token :", doctorId);

    const doctor = await Medecin.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Médecin non trouvé" });
    }

    res.json(doctor);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil médecin :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
