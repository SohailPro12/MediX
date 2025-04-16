const mongoose = require('mongoose');
const RendezVous= require('./src/models/Rendez-vous');

const uri = 'mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX';

function convertToDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day); 
  }
  
mongoose.connect(uri)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch(err => console.error('❌ Erreur de connexion:', err));
  const dateString = "20/03/2025"; 
  const appointmentDate = convertToDate(dateString); 
const addAppointement= async () => {
  try {
    const Appointement = new RendezVous({
        PatientId : '67d02a7d62714bdbdb319b64',
        MedecinId : '67bf863a4b73077159b1c553',
        date : appointmentDate,
        lieu : "Mohemmadia"
    });

    const savedAppointment = await Appointement.save();
    console.log('✅ Nouvelle appointement créée');
   

    // Vérification finale après récupération de la base de données
    const savedAppointmentCheck = await RendezVous.findOne({ PatientId: savedAppointment.PatientId });
    console.log('Rendez-vous récupéré:', savedAppointmentCheck);

    if (savedAppointmentCheck) {
      console.log('✅ Vérification finale réussie');
    } else {
      console.log('❌ Appointement non trouvée après sauvegarde');
    }
  } catch (err) {
    console.error('❌ Erreur:', err);
  } finally {
    mongoose.connection.close();
  }
};

addAppointement();