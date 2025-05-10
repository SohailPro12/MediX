const Patient = require("../../models/Patient");

exports.getProfilePatient = async (req, res) => {
  try {
    const patientId = req.user.id; // ID injecté par le middleware d'authentification
    console.log("ID patient depuis le token :", patientId);

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient non trouvé" });
    }

    res.json(patient);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil patient :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
