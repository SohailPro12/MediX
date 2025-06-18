const mongoose = require('mongoose');
const Clinique = require('./src/models/Clinique');
const Admin = require('./src/models/Admin');

const uri = 'mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX';

mongoose.connect(uri)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch(err => console.error('❌ Erreur de connexion:', err));

const setupDemoData = async () => {
  try {
    console.log('🎬 CONFIGURATION DES DONNÉES DE DÉMONSTRATION MEDIX');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Clear all data for fresh demo
    await Clinique.deleteMany({});
    await Admin.deleteMany({});
    console.log('🗑️ Base de données nettoyée');

    // === CLINIQUES ===
    console.log('\n📋 CRÉATION DES CLINIQUES...');
    
    const clinic1 = new Clinique({
      code_SSO: 'CHU001',
      Nom: 'Centre Hospitalier Universitaire Hassan II',
      adresse: 'Route Sidi Harazem, BP 1893, Km 2.200, Fès 30000',
      telephone: '+212 535 61 78 78',
      mail: 'contact@chu-fes.ma'
    });

    const clinic2 = new Clinique({
      code_SSO: 'CLN002',
      Nom: 'Clinique Al Madina',
      adresse: '85 Boulevard Zerktouni, Casablanca 20100',
      telephone: '+212 522 27 66 66',
      mail: 'info@clinique-almadina.ma'
    });

    await clinic1.save();
    await clinic2.save();
    console.log('✅ 2 cliniques créées');

    // === ADMINS ===
    console.log('\n👥 CRÉATION DES ADMINISTRATEURS...');
    
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

    await admin1.save();
    await admin2.save();
    console.log('✅ 2 administrateurs créés');

    // === RÉSUMÉ POUR LA DÉMONSTRATION ===
    console.log('\n\n🎯 RÉSUMÉ COMPLET - DONNÉES DE DÉMONSTRATION MEDIX');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n🏥 CLINIQUES DISPONIBLES:');
    console.log('┌─────────────────────────────────────────────────────────────────────────┐');
    console.log('│                           CLINIQUE 1 - ACTIVE                            │');
    console.log('├─────────────────────────────────────────────────────────────────────────┤');
    console.log(`│ Code SSO: ${clinic1.code_SSO}                                                      │`);
    console.log(`│ Nom: ${clinic1.Nom}                              │`);
    console.log(`│ Ville: Fès                                                              │`);
    console.log(`│ Téléphone: ${clinic1.telephone}                                    │`);
    console.log(`│ Email: ${clinic1.mail}                                        │`);
    console.log('└─────────────────────────────────────────────────────────────────────────┘');
    
    console.log('\n┌─────────────────────────────────────────────────────────────────────────┐');
    console.log('│                           CLINIQUE 2 - ACTIVE                            │');
    console.log('├─────────────────────────────────────────────────────────────────────────┤');
    console.log(`│ Code SSO: ${clinic2.code_SSO}                                                      │`);
    console.log(`│ Nom: ${clinic2.Nom}                                           │`);
    console.log(`│ Ville: Casablanca                                                      │`);
    console.log(`│ Téléphone: ${clinic2.telephone}                                    │`);
    console.log(`│ Email: ${clinic2.mail}                                 │`);
    console.log('└─────────────────────────────────────────────────────────────────────────┘');

    console.log('\n👨‍💼 COMPTES ADMINISTRATEURS:');
    console.log('┌─────────────────────────────────────────────────────────────────────────┐');
    console.log('│                         ADMIN CHU HASSAN II                             │');
    console.log('├─────────────────────────────────────────────────────────────────────────┤');
    console.log(`│ 👤 Nom complet: ${admin1.prenom} ${admin1.nom}                                      │`);
    console.log(`│ 🆔 CIN: ${admin1.cin}                                                    │`);
    console.log(`│ 📧 Email: ${admin1.mail}                                    │`);
    console.log(`│ 🔑 Mot de passe: Admin123!                                             │`);
    console.log(`│ 📞 Téléphone: ${admin1.telephone}                                 │`);
    console.log(`│ 🏥 Clinique: ${clinic1.Nom}                              │`);
    console.log('└─────────────────────────────────────────────────────────────────────────┘');

    console.log('\n┌─────────────────────────────────────────────────────────────────────────┐');
    console.log('│                      ADMIN CLINIQUE AL MADINA                          │');
    console.log('├─────────────────────────────────────────────────────────────────────────┤');
    console.log(`│ 👤 Nom complet: ${admin2.prenom} ${admin2.nom}                                         │`);
    console.log(`│ 🆔 CIN: ${admin2.cin}                                                    │`);
    console.log(`│ 📧 Email: ${admin2.mail}                                │`);
    console.log(`│ 🔑 Mot de passe: Admin123!                                             │`);
    console.log(`│ 📞 Téléphone: ${admin2.telephone}                                 │`);
    console.log(`│ 🏥 Clinique: ${clinic2.Nom}                                           │`);
    console.log('└─────────────────────────────────────────────────────────────────────────┘');

    console.log('\n🔐 INFORMATIONS DE CONNEXION POUR LA DÉMONSTRATION:');
    console.log('┌─────────────────────────────────────────────────────────────────────────┐');
    console.log('│                            CONNEXIONS ADMIN                            │');
    console.log('├─────────────────────────────────────────────────────────────────────────┤');
    console.log('│ Admin CHU:                                                              │');
    console.log('│   📧 admin.chu@medix.ma                                                 │');
    console.log('│   🔑 Admin123!                                                          │');
    console.log('│                                                                         │');
    console.log('│ Admin Clinique Al Madina:                                               │');
    console.log('│   📧 admin.almadina@medix.ma                                            │');
    console.log('│   🔑 Admin123!                                                          │');
    console.log('└─────────────────────────────────────────────────────────────────────────┘');

    // Verification
    const totalClinics = await Clinique.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    
    console.log('\n✅ VÉRIFICATION FINALE:');
    console.log(`   📊 ${totalClinics} cliniques en base de données`);
    console.log(`   👥 ${totalAdmins} administrateurs en base de données`);
    
    console.log('\n🎬 SYSTÈME PRÊT POUR LA DÉMONSTRATION!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 Conseil: Utilisez ces comptes pour montrer les fonctionnalités admin');
    console.log('💡 Les deux cliniques sont actives et prêtes pour les démonstrations');

  } catch (err) {
    console.error('❌ Erreur lors de la configuration:', err);
  } finally {
    mongoose.connection.close();
  }
};

setupDemoData();
