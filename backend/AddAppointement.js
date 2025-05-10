const mongoose = require('mongoose');
const RendezVous = require('./src/models/Rendez-vous');
const Patient = require('./src/models/Patient'); // Import ajouté
const Medecin = require('./src/models/Medecin'); // Import ajouté

const uri = 'mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX';

// Configuration pour éviter les avertissements
mongoose.set('strictQuery', true);

function convertToDateWithTime(dateStr, hour = 0, minute = 0) {
  const [day, month, year] = dateStr.split("/");
  const date = new Date(year, month - 1, day, hour, minute, 0, 0);
  return date;
}

async function main() {
  try {
    // Connexion à MongoDB avec les nouvelles options
    await mongoose.connect(uri, {
      connectTimeoutMS: 30000, // 30 secondes de timeout
      socketTimeoutMS: 45000   // 45 secondes de timeout
    });
    console.log('✅ Connexion à MongoDB réussie');

    // Vérification que les modèles sont bien enregistrés
    if (!mongoose.models.Patient || !mongoose.models.Medecin) {
      throw new Error('Les modèles Patient ou Medecin ne sont pas enregistrés');
    }

    // Création du rendez-vous
    const appointmentDate = convertToDateWithTime("2/04/2025", 20, 30);
    console.log('📅 Date du rendez-vous:', appointmentDate);

    const appointment = new RendezVous({
      PatientId: '681df223e2e0a4ccee006c88',
      MedecinId: '6802e494aab10c2df1cb9c4a',
      date: appointmentDate,
      lieu: "Mohammedia",
      observation: "Rendez-vous pour consultation",
      status: "confirmed",
      motif: "Consultation générale"
    });

    // Sauvegarde avec validation
    const savedAppointment = await appointment.save();
    console.log('✅ Nouveau rendez-vous créé:', savedAppointment._id);

    // Vérification avec population
    const foundAppointment = await RendezVous.findById(savedAppointment._id)
      .populate('PatientId', 'nom prenom')
      .populate('MedecinId', 'nom prenom specialite')
      .lean();

    if (foundAppointment) {
      console.log('🔍 Rendez-vous vérifié:');
      console.log('- Patient:', foundAppointment.PatientId?.nom, foundAppointment.PatientId?.prenom);
      console.log('- Médecin:', foundAppointment.MedecinId?.nom, foundAppointment.MedecinId?.prenom);
      console.log('- Spécialité:', foundAppointment.MedecinId?.specialite);
    } else {
      throw new Error('Rendez-vous non trouvé après création');
    }

  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1); // Quitte avec code d'erreur
  } finally {
    await mongoose.disconnect();
    console.log('📴 Connexion MongoDB fermée');
  }
}

// Exécution
main();