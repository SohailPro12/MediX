const mongoose = require('mongoose');
const Clinique = require('./src/models/Clinique');

const uri = 'mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX';

mongoose.connect(uri)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch(err => console.error('❌ Erreur de connexion:', err));

const addTestClinics = async () => {
  try {
    // Clear existing clinics for clean demo data
    await Clinique.deleteMany({});
    console.log('🗑️ Anciennes cliniques supprimées');

    // Clinic 1: Active - Centre Hospitalier Universitaire Hassan II (Fès)
    const clinic1 = new Clinique({
      code_SSO: 'CHU001',
      Nom: 'Centre Hospitalier Universitaire Hassan II',
      adresse: 'Route Sidi Harazem, BP 1893, Km 2.200, Fès 30000',
      telephone: '+212 535 61 78 78',
      mail: 'contact@chu-fes.ma'
    });

    // Clinic 2: Active - Clinique Al Madina (Casablanca)
    const clinic2 = new Clinique({
      code_SSO: 'CLN002',
      Nom: 'Clinique Al Madina',
      adresse: '85 Boulevard Zerktouni, Casablanca 20100',
      telephone: '+212 522 27 66 66',
      mail: 'info@clinique-almadina.ma'
    });

    // Save both clinics
    await clinic1.save();
    await clinic2.save();

    console.log('✅ Cliniques de démonstration créées avec succès!');
    console.log('\n📊 DONNÉES DES CLINIQUES POUR LA DÉMONSTRATION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n🏥 CLINIQUE 1 (Active):');
    console.log(`   Code SSO: ${clinic1.code_SSO}`);
    console.log(`   Nom: ${clinic1.Nom}`);
    console.log(`   Adresse: ${clinic1.adresse}`);
    console.log(`   Téléphone: ${clinic1.telephone}`);
    console.log(`   Email: ${clinic1.mail}`);
    
    console.log('\n🏥 CLINIQUE 2 (Active):');
    console.log(`   Code SSO: ${clinic2.code_SSO}`);
    console.log(`   Nom: ${clinic2.Nom}`);
    console.log(`   Adresse: ${clinic2.adresse}`);
    console.log(`   Téléphone: ${clinic2.telephone}`);
    console.log(`   Email: ${clinic2.mail}`);

    // Verify the clinics were saved correctly
    const savedClinics = await Clinique.find({});
    console.log(`\n✅ Vérification: ${savedClinics.length} cliniques sauvegardées en base`);
    
    console.log('\n🎬 PRÊT POUR LA DÉMONSTRATION!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (err) {
    console.error('❌ Erreur lors de la création des cliniques:', err);
  } finally {
    mongoose.connection.close();
  }
};

addTestClinics();
