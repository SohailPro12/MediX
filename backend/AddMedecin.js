const mongoose = require('mongoose');
const medecin = require('./src/models/Medecin');

const uri = 'mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX';

mongoose.connect(uri)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch(err => console.error('❌ Erreur de connexion:', err));

const addMedecin = async () => {
  try {
    const med = new medecin({
        code_SSO: '1',
  nom : 'bou',
  prenom : 'anass',
    cin : 'V1234567',
  age : 25,
  mail: 'as.bouderhem@gmail.com',
  password: 'medecin',
  telephone: '0535567890',
  specialite: 'cardiologue',
  sexe: 'homme',
  disponibilite: [{
    jour: 'lundi',
    heureDebut: '08:00',
    heureFin: '12:00'
  }],
  experience: '5 ans',
  formation: 'bac+7',
  adresse: 'Fes',
  role: 'medecin',
    });

    await med.save();
    console.log('✅ Nouvelle admin créée');
    console.log({
      mail: med.mail,
    });

    // Vérification finale après récupération de la base de données
    const adminSauvegardée = await medecin.findOne({mail: med.mail});
    console.log('medecin sauvegardée:', adminSauvegardée);

    if (adminSauvegardée) {
      console.log('✅ Vérification finale réussie');
    } else {
      console.log('❌ medecin non trouvée après sauvegarde');
    }
  } catch (err) {
    console.error('❌ Erreur:', err);
  } finally {
    mongoose.connection.close();
  }
};

addMedecin();
