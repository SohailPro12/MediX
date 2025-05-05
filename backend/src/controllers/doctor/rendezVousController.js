// controllers/doctor/getAppointment.js
const RendezVous  = require("../../models/Rendez-vous");
const Ordonnance  = require("../../models/Ordonnance");

exports.getAppointments = async (req, res) => {
  try {
    const medecinId = req.user.id;
    const startDate = new Date(req.query.start);
    const endDate   = new Date(req.query.end);

    const rdvs = await RendezVous.find({
      MedecinId: medecinId,
      date:      { $gte: startDate, $lte: endDate },
      status:    'confirmed'
    })
    .populate("PatientId", "nom prenom")
    .sort({ date: 1 })
    .lean(); // pour retourner de simples objets JS

    const withOrdonnance = await Promise.all(
      rdvs.map(async (rdv) => {
        const ord = await Ordonnance.findOne({ RendezVousId: rdv._id }).select("_id");

        return {
          // expose les deux…  
          _id:           rdv._id,
          id:            rdv._id.toString(),          // <— ajouté
          appointmentId: rdv._id.toString(),          // <— pratique si tu veux ce nom-là
          
          date:        rdv.date,
          observation: rdv.observation,
          PatientId:   rdv.PatientId,
          ordonnanceId: ord ? ord._id.toString() : null
        };
      })
    );
console.log("rdvs", withOrdonnance);
    res.status(200).json(withOrdonnance);
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des rendez‑vous."
    });
  }
};


// 🔵 NOUVEAU: Récupérer un rendez-vous par ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const rdv = await RendezVous.findById(id)
      .populate('PatientId', 'nom prenom')  // <--- ⚡ On récupère juste nom et prénom
      .populate('MedecinId', 'nom prenom');  // (si besoin aussi)

    if (!rdv) {
      return res.status(404).json({ message: "Rendez-vous introuvable" });
    }

    res.status(200).json(rdv);
  } catch (error) {
    console.error("Erreur récupération rendez-vous:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
