const mongoose = require('mongoose');
const RendezVous = require('./src/models/Rendez-vous');

const uri = 'mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX';

function convertToDateWithTime(dateStr, hour = 0, minute = 0) {
  const [day, month, year] = dateStr.split("/");
  const date = new Date(year, month - 1, day, hour, minute, 0, 0);
  return date;
}



mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connexion à MongoDB réussie');
    addAppointment(); // Appel de la fonction après connexion
  })
  .catch(err => {
    console.error('❌ Erreur de connexion à MongoDB:', err);
  });

async function addAppointment() {
  try {
  // Exemple : 23 avril 2025 à 14h30
const appointmentDate = convertToDateWithTime("2/04/2025", 20, 30);
console.log(appointmentDate);  

    const appointment = new RendezVous({
      PatientId: '67bf8a6cdd399a496d546d0e',
      MedecinId: '68090e8681676d41dcd09cb7',
      date: appointmentDate,
      lieu: "Mohammedia" ,
      observation: "Rendez-vous pour consultation",
      status: "pending",
      motif: "Consultation générale",
    });

    const savedAppointment = await appointment.save();
    console.log('✅ Nouveau rendez-vous créé');

    const savedAppointmentCheck = await RendezVous.findOne({ _id: savedAppointment._id }).populate('PatientId MedecinId');
    console.log('📝 Rendez-vous récupéré:', savedAppointmentCheck);

    if (savedAppointmentCheck) {
      console.log('✅ Vérification finale réussie');
    } else {
      console.log('❌ Rendez-vous non retrouvé après sauvegarde');
    }
  } catch (err) {
    console.error('❌ Erreur lors de l’ajout du rendez-vous :', err);
  } finally {
    await mongoose.connection.close();
      console.log('📴 Connexion MongoDB fermée');
    
  }
}
