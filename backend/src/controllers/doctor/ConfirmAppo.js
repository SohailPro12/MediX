const mongoose = require("mongoose");
const Appointment = require("../../models/Rendez-vous");
const Medecin = require("../../models/Medecin");
const sendEmail = require('../../utils/sendEmail');
const {getFormattedDateInfo} = require('../../utils/Formatage_Dates');
exports.confirmerAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { id } = req.params;  
    console.log("ID du rendez-vous à confirmer:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID de rendez-vous invalide" });
    }

    const RDV = await Appointment.findByIdAndUpdate(
      id,
      { status: "confirmed" },
      { new: true, session }  // <-- session doit être ici, dans les options
    )
    .populate('MedecinId')
    .populate('PatientId');

    if (!RDV) {
      return res.status(404).json({ error: "Rendez-vous non trouvé" });
    }
    const { jourAbrege, timeStr: heureRdv } = getFormattedDateInfo(RDV.date);

    // Mise à jour des disponibilités du médecin
    await Medecin.findByIdAndUpdate(
      RDV.MedecinId._id,
      {
        $pull: {
          disponibilite: {
            jour: jourAbrege,
            heureDebut: heureRdv
          }
        }
      },
      { session }
    );

    await session.commitTransaction();

    // Préparation du contenu email
    const dateLocale = getFormattedDateInfo(RDV.date);

    const content = `
      <h2>Bonjour ${RDV.PatientId.nom} ${RDV.PatientId.prenom},</h2>
      <p>Votre rendez-vous a été confirmé :</p>
      <ul>
        <li><strong>Date :</strong> ${dateLocale.dateStr}</li>
        <li><strong>Heure :</strong> ${dateLocale.timeStr}</li>
        <li><strong>Médecin :</strong> Dr. ${RDV.MedecinId.nom} ${RDV.MedecinId.prenom}</li>
        <li><strong>Spécialité :</strong> ${RDV.MedecinId.specialite}</li>
        <li><strong>Lieu :</strong> ${RDV.lieu}</li>
      </ul>
      <p style="color: gray;">Merci de ne pas répondre à ce message.</p>
      <p>Cordialement,<br/>
      <strong>L’équipe MediX</strong></p>
    `;

    await sendEmail(RDV.PatientId.mail, `Confirmation de votre rendez-vous`, content);

    res.status(200).json(RDV);

  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la confirmation' });
  } finally {
    session.endSession();
  }
};
