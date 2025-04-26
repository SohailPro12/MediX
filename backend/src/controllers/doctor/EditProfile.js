const Medecin = require("../../models/Medecin");

exports.EditProfile = async (req, res) => {
  try {
    const doctorId = req.user.id;
    console.log("ID Médecin depuis le token :", doctorId);

    const doctor = await Medecin.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Médecin non trouvé" });
    }

    const { nom, email, specialite, photo, description, formation, experience } = req.body;

    // Mise à jour des champs de base
    if (nom) doctor.nom = nom;
    if (email) doctor.mail = email;
    if (specialite) doctor.specialite = specialite;
    if (photo) doctor.Photo = photo;
    if (description) doctor.description = description;

    // ✅ Met à jour les champs tableau seulement s'ils sont bien des tableaux
    if (Array.isArray(formation)) {
      doctor.formation = formation;
    }

    if (Array.isArray(experience)) {
      doctor.experience = experience;
    }

    await doctor.save();

    res.status(200).json({
      message: "Profil mis à jour avec succès",
      doctor: {
        nom: doctor.nom,
        prenom: doctor.prenom,
        mail: doctor.mail,
        specialite: doctor.specialite,
        Photo: doctor.Photo,
        description: doctor.description,
        formation: doctor.formation,
        experience: doctor.experience
      }
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil médecin :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
