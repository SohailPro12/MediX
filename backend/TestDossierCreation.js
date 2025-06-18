const mongoose = require('mongoose');
const DossierMedical = require('./src/models/Dossier_medical');
const Patient = require('./src/models/Patient');

const uri = 'mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX';

mongoose.connect(uri)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch(err => console.error('❌ Erreur de connexion:', err));

const testDossierCreation = async () => {
  try {
    console.log('🧪 Test de création d\'un dossier médical...');
    
    // Créer un patient de test
    const testPatient = new Patient({
      id_medecin: '507f1f77bcf86cd799439011', // ID fictif
      code_SSO: 'TEST001',
      nom: 'Test',
      prenom: 'Patient',
      cin: 'TEST123',
      mail: 'test@test.com',
      telephone: '0600000000',
      password: 'testpassword',
      verifie: false
    });
    
    await testPatient.save();
    console.log(`✅ Patient de test créé avec l'ID: ${testPatient._id}`);
    
    // Créer le dossier médical
    const testDossier = new DossierMedical({
      numero: `DM-${testPatient._id.toString().slice(-8)}`,
      PatientId: testPatient._id,
      dateCreation: new Date(),
      dateModification: new Date(),
      analyses: [],
      traitemant: [],
      ordonnances: []
    });
    
    await testDossier.save();
    console.log(`✅ Dossier médical créé avec l'ID: ${testDossier._id}`);
    console.log(`📋 Numéro du dossier: ${testDossier.numero}`);
    
    // Mettre à jour le patient
    testPatient.dossierMedicalId = testDossier._id.toString();
    await testPatient.save();
    console.log(`✅ Patient mis à jour avec l'ID du dossier médical`);
    
    // Vérification
    const verifyPatient = await Patient.findById(testPatient._id);
    const verifyDossier = await DossierMedical.findById(testDossier._id);
    
    console.log('\n📊 VÉRIFICATION:');
    console.log(`Patient ID: ${verifyPatient._id}`);
    console.log(`Dossier Medical ID dans patient: ${verifyPatient.dossierMedicalId}`);
    console.log(`Dossier Medical ID réel: ${verifyDossier._id}`);
    console.log(`PatientId dans dossier: ${verifyDossier.PatientId}`);
    
    if (verifyPatient.dossierMedicalId === verifyDossier._id.toString()) {
      console.log('✅ Liaison patient-dossier médical réussie!');
    } else {
      console.log('❌ Problème de liaison patient-dossier médical');
    }
    
    // Nettoyage
    await Patient.findByIdAndDelete(testPatient._id);
    await DossierMedical.findByIdAndDelete(testDossier._id);
    console.log('🧹 Données de test supprimées');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    mongoose.connection.close();
  }
};

testDossierCreation();
