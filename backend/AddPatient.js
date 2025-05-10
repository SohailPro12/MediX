const mongoose = require('mongoose');
const Patient = require('./src/models/Patient');

const uri = 'mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX';

mongoose.connect(uri)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch(err => console.error('❌ Erreur de connexion:', err));

const addPatient = async () => {
  try {
    const pat = new Patient({
      code_SSO: '1',
      cin: 'A12345',
      nom: 'Bou',
      prenom: 'anass',
      age: 30,
      sexe: 'homme',
      mail: 'Anass@patient.com',
      password: 'patient',
      telephone: '0535567890',
      adresse: 'Fes',
      role: 'patient',
    });

    await pat.save();
    console.log('✅ Nouvelle admin créée');
    console.log({
      mail: pat.mail,
    });

    // Vérification finale après récupération de la base de données
    const adminSauvegardée = await Patient.findOne({mail: pat.mail});
    console.log('patient sauvegardée:', adminSauvegardée);

    if (adminSauvegardée) {
      console.log('✅ Vérification finale réussie');
    } else {
      console.log('❌ patient non trouvée après sauvegarde');
    }
  } catch (err) {
    console.error('❌ Erreur:', err);
  } finally {
    mongoose.connection.close();
  }
};

addPatient();
