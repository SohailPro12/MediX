const RendezVous = require('../../models/Rendez-vous'); 
const Medecin = require('../../models/Medecin'); // ou selon ton chemin
const sendEmail = require('../../utils/sendEmail');
const {getFormattedDateInfo} = require('../../utils/Formatage_Dates');

exports.PostAppointment = async (req, res) => {
  try {
    const {nom, prenom, cin, mail, telephone, PatientId, MedecinId, date, motif } = req.body;
    if (!PatientId || !MedecinId || !date) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }

    const medecin = await Medecin.findById(MedecinId);
    if (!medecin) {
    return res.status(404).json({ message: "Médecin non trouvé" });
    }
    const nouveauRdv = new RendezVous({
      PatientId,
      MedecinId,
      date,
      motif,
      lieu: medecin.adresse
    });
    await nouveauRdv.save();
    res.status(200).json({ message: "Rendez-vous créé et email envoyé !" });

    const dateLocale = getFormattedDateInfo(nouveauRdv.date);
const contentP = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Bonjour ${nom} ${prenom},</h2>
    <p> Votre demande de rendez-vous pour le <strong>${dateLocale.dateStr}</strong> à <strong>${dateLocale.timeStr}</strong> a bien été envoyée pour confirmation.</p>
    <p> Une fois que le Dr ${medecin.nom} ${medecin.prenom} aura confirmé le rendez-vous, vous en serez informé dans l’application <strong>MediX</strong> et recevrez également un email de confirmation.</p>
    <p style="color: gray;"> Merci de ne pas répondre à ce message.</p>
    <p>Cordialement,<br/>
      <strong>L’équipe MediX</strong>
    </p>
  </div>
`;

    // Envoi de l'email
    await sendEmail(mail, `Votre rendez-vous avec Dr ${medecin.nom} est en cours de validation`, contentP);

    const contentM = `
  <h2>Bonjour Dr ${medecin.prenom} ${medecin.nom},</h2>

  <p>Un patient a pris un rendez-vous via la plateforme MediX :</p>
  <ul>
    <li><strong>Patient :</strong> ${nom} ${prenom}</li>
    <li><strong>Date :</strong> ${dateLocale.dateStr}</li>
    <li><strong>Heure :</strong> ${dateLocale.timeStr}</li>
    <li><strong>CIN :</strong> ${cin}</li>
    <li><strong>e-mail :</strong> ${mail}</li>
    <li><strong>Télephone :</strong> ${telephone}</li>
    <li><strong>Motif :</strong> ${motif || "Non précisé"}</li>
  </ul>
  <p>Merci de vous connecter à votre espace médecin afin de confirmer ou refuser ce rendez-vous.</p>
     <p>Cordialement,<br/>
      <strong>L’équipe MediX</strong>
    </p>
`;

    // Envoi de l'email
    await sendEmail(medecin.mail, `Nouveau rendez-vous à confirmer `, contentM);


  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du rendez-vous' });
  }
};



