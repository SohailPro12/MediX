const mongoose = require('mongoose');
const Appointment = require('../../models/Rendez-vous'); 
const Medecin = require("../../models/Medecin");
const sendEmail = require('../../utils/sendEmail');
const {getFormattedDateInfo} = require('../../utils/Formatage_Dates');

exports.rescheduleAppointment = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { appointmentId, newDateTime } = req.body;

    // Récupérer l'ancien rendez-vous (sans session car lecture hors transaction possible)
    const oldAppointment = await Appointment.findById(appointmentId)
      .populate('PatientId')
      .populate('MedecinId');

    if (!oldAppointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Mettre à jour le rendez-vous avec la nouvelle date (avec session)
    await Appointment.findByIdAndUpdate(
      appointmentId,
      { date: newDateTime, status: "confirmed" },
      { session }
    );

    // Recharger le rendez-vous mis à jour avec population (hors transaction)
    const updatedAppointment = await Appointment.findById(appointmentId)
      .populate('PatientId')
      .populate('MedecinId');

    const { jourAbrege, timeStr: heureRdv } = getFormattedDateInfo(updatedAppointment.date);

    // Mise à jour des disponibilités du médecin (avec session)
    await Medecin.findByIdAndUpdate(
      updatedAppointment.MedecinId._id,
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

    // Formatage dates pour email
    const ancienneDateInfo = getFormattedDateInfo(oldAppointment.date);
    const nouvelleDateInfo = getFormattedDateInfo(newDateTime);

    const content = `
      <h2>Bonjour ${updatedAppointment.PatientId.nom} ${updatedAppointment.PatientId.prenom},</h2>
      <p>Nous vous informons que votre rendez-vous initialement prévu le 
      <strong>${ancienneDateInfo.dateStr}</strong> à <strong>${ancienneDateInfo.timeStr}</strong> a été modifié.</p>
      <p>Voici les nouvelles informations de votre rendez-vous :</p>
      <ul>
        <li><strong>Date :</strong> ${nouvelleDateInfo.dateStr}</li>
        <li><strong>Heure :</strong> ${nouvelleDateInfo.timeStr}</li>
        <li><strong>Médecin :</strong> Dr. ${updatedAppointment.MedecinId.nom} ${updatedAppointment.MedecinId.prenom}</li>
        <li><strong>Spécialité :</strong> ${updatedAppointment.MedecinId.specialite}</li>
        <li><strong>Lieu :</strong> ${updatedAppointment.lieu}</li>
      </ul>
      <p>Pour toute autre information, veuillez contacter votre médecin via l'application 
        <strong>MediX</strong>, ou par téléphone au <strong>${updatedAppointment.MedecinId.telephone}</strong>, 
        ou par e-mail à <a href="mailto:${updatedAppointment.MedecinId.mail}">${updatedAppointment.MedecinId.mail}</a>.</p>
      <p>Nous nous excusons pour la gêne occasionnée et restons à votre disposition pour tout complément d’information.</p>
      <p style="color: gray;">Merci de ne pas répondre à ce message.</p>
      <p>Cordialement,<br/>
      <strong>L’équipe MediX</strong></p>
    `;

    // Envoi de l'email hors transaction
    await sendEmail(updatedAppointment.PatientId.mail, `Nouveau rendez-vous à confirmer`, content);

    res.status(200).json(updatedAppointment);
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la replanification' });
  } finally {
    session.endSession();
  }
};
