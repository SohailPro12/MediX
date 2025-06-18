const mongoose = require('mongoose');
const RendezVous = require('./src/models/Rendez-vous');

const uri = 'mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX';

mongoose.connect(uri)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch(err => console.error('❌ Erreur de connexion:', err));

const addTestAppointment = async () => {
  try {
    // Sample appointment data
    const appointmentData = {
      PatientId: "6851d2d7f038643fc34be671",
      MedecinId: "6851d56cf038643fc34be69f",
      date: new Date("2025-06-20T10:30:00.000Z"),
      lieu: "Cabinet médical - 123 Avenue Mohammed V, Casablanca",
      motif: "Consultation de contrôle général",
      observation: "",
      status: "confirmed",
      ordonnance: null,
      rating: null
    };

    const newAppointment = new RendezVous(appointmentData);
    const savedAppointment = await newAppointment.save();
    
    console.log('✅ Rendez-vous créé avec succès:', savedAppointment);

    // Add a second appointment
    const appointmentData2 = {
      PatientId: "6851d2d7f038643fc34be671",
      MedecinId: "6851d56cf038643fc34be69f",
      date: new Date("2025-06-25T14:00:00.000Z"),
      lieu: "Clinique Al Amal - 45 Rue Ibn Sina, Rabat",
      motif: "Consultation spécialisée en cardiologie",
      observation: "Patient se plaint de douleurs thoraciques occasionnelles",
      status: "pending",
      ordonnance: null,
      rating: null
    };

    const newAppointment2 = new RendezVous(appointmentData2);
    const savedAppointment2 = await newAppointment2.save();
    
    console.log('✅ Deuxième rendez-vous créé avec succès:', savedAppointment2);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création du rendez-vous:', error);
    process.exit(1);
  }
};

addTestAppointment();
