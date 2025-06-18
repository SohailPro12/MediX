const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');

const uri = 'mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX';

mongoose.connect(uri)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch(err => console.error('❌ Erreur de connexion:', err));

const addTestAdmins = async () => {
  try {
    // Clear existing admins for clean demo data
    await Admin.deleteMany({});
    console.log('🗑️ Anciens admins supprimés');

    // Admin 1: For CHU Hassan II (code_SSO: CHU001)
    const admin1 = new Admin({
      code_SSO: 'CHU001',
      role: 'admin',
      nom: 'Bennani',
      prenom: 'Mohammed',
      cin: 'AB123456',
      mail: 'admin.chu@medix.ma',
      password: 'Admin123!',
      telephone: '+212 535 61 70 00'
    });

    // Admin 2: For Clinique Al Madina (code_SSO: CLN002)
    const admin2 = new Admin({
      code_SSO: 'CLN002',
      role: 'admin',
      nom: 'Alaoui',
      prenom: 'Fatima',
      cin: 'CD789012',
      mail: 'admin.almadina@medix.ma',
      password: 'Admin123!',
      telephone: '+212 522 27 60 00'
    });

    // Save both admins
    await admin1.save();
    await admin2.save();

    console.log('✅ Admins de démonstration créés avec succès!');
    console.log('\n👥 DONNÉES DES ADMINS POUR LA DÉMONSTRATION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n👨‍💼 ADMIN 1 (CHU Hassan II):');
    console.log(`   Code SSO Clinique: ${admin1.code_SSO}`);
    console.log(`   Nom: ${admin1.nom}`);
    console.log(`   Prénom: ${admin1.prenom}`);
    console.log(`   CIN: ${admin1.cin}`);
    console.log(`   Email: ${admin1.mail}`);
    console.log(`   Mot de passe: Admin123!`);
    console.log(`   Téléphone: ${admin1.telephone}`);
    
    console.log('\n👩‍💼 ADMIN 2 (Clinique Al Madina):');
    console.log(`   Code SSO Clinique: ${admin2.code_SSO}`);
    console.log(`   Nom: ${admin2.nom}`);
    console.log(`   Prénom: ${admin2.prenom}`);
    console.log(`   CIN: ${admin2.cin}`);
    console.log(`   Email: ${admin2.mail}`);
    console.log(`   Mot de passe: Admin123!`);
    console.log(`   Téléphone: ${admin2.telephone}`);

    // Verify the admins were saved correctly
    const savedAdmins = await Admin.find({});
    console.log(`\n✅ Vérification: ${savedAdmins.length} admins sauvegardés en base`);
    
    console.log('\n🔐 COMPTES DE CONNEXION POUR LA DÉMONSTRATION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin CHU Hassan II:');
    console.log('  📧 Email: admin.chu@medix.ma');
    console.log('  🔑 Mot de passe: Admin123!');
    console.log('');
    console.log('Admin Clinique Al Madina:');
    console.log('  📧 Email: admin.almadina@medix.ma');
    console.log('  🔑 Mot de passe: Admin123!');

  } catch (err) {
    console.error('❌ Erreur lors de la création des admins:', err);
  } finally {
    mongoose.connection.close();
  }
};

addTestAdmins();
