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
  nom : 'med',
  prenom : 'medecin',
    cin : 'A1234567',
  age : 25,
  IdProfessionnel: 123,
  mail: 'anass@medecin.com',
  password: 'medecin',
  telephone: '0535567890',
  specialite: 'cardiologue',
  sexe: 'homme',
  disponibilite: [{
    jour: 'lundi',
    heureDebut: '08:00',
    heureFin: '12:00'
  }],
  experience: ['5 ans in cardiology department in hospital ibn rochd', '3 years in private clinic', '2 years in public hospital'], 
  formation: ['bac+7 in cardiology', 'bac+5 in general medicine'],
  description: 'I am a cardiologist with 10 years of experience in the field of cardiology  and I am here to help you with your heart problems', 
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
