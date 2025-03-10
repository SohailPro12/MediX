const mongoose = require('mongoose');
const Clinique = require('./src/models/Clinique');

const uri = 'mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX';

mongoose.connect(uri)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch(err => console.error('❌ Erreur de connexion:', err));

const addClinique = async () => {
  try {
    const clinique = new Clinique({
      code_SSO: '2',
      mail: 'CHU@gmail.com',
      Nom: 'CHU',
      telephone: '0535567890',
      adresse: 'Fes',
    });

    await clinique.save();
    console.log('✅ Nouvelle clinique créée');
    console.log({
      mail: clinique.mail,
    });

    // Vérification finale après récupération de la base de données
    const cliniqueSauvegardée = await Clinique.findOne({ code_SSO: this.code_SSO });
    console.log('Clinique sauvegardée:', cliniqueSauvegardée);

    if (cliniqueSauvegardée) {
      console.log('✅ Vérification finale réussie');
    } else {
      console.log('❌ Clinique non trouvée après sauvegarde');
    }
  } catch (err) {
    console.error('❌ Erreur:', err);
  } finally {
    mongoose.connection.close();
  }
};

addClinique();
