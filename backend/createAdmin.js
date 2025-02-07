const mongoose = require('mongoose');
const ConnexionAdmin = require('./models/ConnexionAdmin');

const uri = 'mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX';

mongoose.connect(uri)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch(err => console.error('❌ Erreur de connexion:', err));

const addAdmin = async () => {
  try {
    // Supprimer l'utilisateur existant
    await ConnexionAdmin.deleteOne({ mail: 'Admin@1' });
    console.log('✅ Ancien admin supprimé');

    // Créer un nouvel utilisateur avec un mot de passe haché
    const motDePasse = '1';
    const admin = new ConnexionAdmin({
      mail: 'Admin@1',
      password: motDePasse
    });

    await admin.save();
    console.log('✅ Nouvel admin créé');
    console.log({
      email: admin.mail,
      motDePasse: motDePasse,
      hash: admin.password
    });

    // Vérification finale après récupération de la base de données
    const adminSauvegardé = await ConnexionAdmin.findOne({ mail: 'Admin@1' });
    console.log('Admin sauvegardé:', adminSauvegardé);

    if (adminSauvegardé) {
      const bcrypt = require('bcrypt');
      const comparaisonFinale = await bcrypt.compare(motDePasse, adminSauvegardé.password);
      console.log('Vérification finale:', comparaisonFinale); // Devrait être true
    } else {
      console.log('❌ Admin non trouvé après sauvegarde');
    }

  } catch (err) {
    console.error('❌ Erreur:', err);
  } finally {
    mongoose.connection.close();
  }
};

addAdmin();
