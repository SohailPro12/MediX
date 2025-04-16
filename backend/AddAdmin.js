const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');

const uri = 'mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX';

mongoose.connect(uri)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch(err => console.error('❌ Erreur de connexion:', err));

const addAdmin = async () => {
  try {
    const admin = new Admin({
        code_SSO: '1',
        role: 'admin',
        nom : 'admin',
        prenom : 'admin',
        cin : 'A1234567',
        mail: 'admin@admin.com',
        password: 'admin',
        telephone: '0535567890',
        image: 'https://res.cloudinary.com/dci4xpmbe/image/upload/v1742977522/medix/Admins/iguhhbxyxjtimsqjt9mp.png'
    });

    await admin.save();
    console.log('✅ Nouvelle admin créée');
    console.log({
      mail: admin.mail,
    });

    // Vérification finale après récupération de la base de données
    const adminSauvegardée = await Admin.findOne({mail: admin.mail});
    console.log('admin sauvegardée:', adminSauvegardée);

    if (adminSauvegardée) {
      console.log('✅ Vérification finale réussie');
    } else {
      console.log('❌ admin non trouvée après sauvegarde');
    }
  } catch (err) {
    console.error('❌ Erreur:', err);
  } finally {
    mongoose.connection.close();
  }
};

addAdmin();
