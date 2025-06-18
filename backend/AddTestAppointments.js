const mongoose = require('mongoose');
const RendezVous = require('./src/models/Rendez-vous');

const uri = 'mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX';

mongoose.connect(uri)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch(err => console.error('❌ Erreur de connexion:', err));

const addTestAppointments = async () => {
  try {
    // Create a test appointment for tomorrow at 10:30 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 30, 0, 0);
    
    const testAppointment = new RendezVous({
      PatientId: "6851d2d7f038643fc34be671",
      MedecinId: "6851d56cf038643fc34be69f", 
      date: tomorrow,
      lieu: "Cabinet médical - 123 Avenue Mohammed V, Casablanca",
      motif: "Consultation de contrôle général",
      observation: "Patient en bonne santé générale",
      status: "confirmed",
      ordonnance: null,
      rating: null
    });

    await testAppointment.save();
    console.log('✅ Rendez-vous de test créé avec succès:', testAppointment._id);

    // Create another appointment for next week
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(14, 0, 0, 0);
    
    const testAppointment2 = new RendezVous({
      PatientId: "6851d2d7f038643fc34be671",
      MedecinId: "6851d56cf038643fc34be69f",
      date: nextWeek,
      lieu: "Clinique Al Amal - 45 Rue Ibn Sina, Rabat",
      motif: "Consultation spécialisée en cardiologie",
      observation: "Suivi cardiologique de routine",
      status: "pending",
      ordonnance: null,
      rating: null
    });

    await testAppointment2.save();
    console.log('✅ Deuxième rendez-vous de test créé avec succès:', testAppointment2._id);

  } catch (error) {
    console.error('❌ Erreur lors de la création des rendez-vous de test:', error);
  } finally {
    mongoose.connection.close();
  }
};

addTestAppointments();
