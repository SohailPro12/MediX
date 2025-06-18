const mongoose = require('mongoose');
const Medecin = require('./src/models/Medecin');

const uri = 'mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX';

mongoose.connect(uri)
  .then(() => console.log('✅ Connexion à MongoDB réussie'))
  .catch(err => console.error('❌ Erreur de connexion:', err));

const addTestDoctors = async () => {
  try {
    // Clear existing doctors for clean demo data


    // Doctor 1: Dr. Sarah Benali - Cardiologue (CHU Hassan II - Fès)
    const doctor1 = new Medecin({
      code_SSO: 'AK001',
      cin: 'AB123456',
      nom: 'Benali',
      prenom: 'Sarah',
      age: 42,
      mail: 'dr.sarah.benali@chu-fes.ma',
      password: 'DocFes2024!',
      telephone: '+212 535 61 72 34',
      specialite: 'Cardiologie',
      sexe: 'femme',
      disponibilite: [
        {
          jour: 'lundi',
          heureDebut: '08:00',
          heureFin: '16:00'
        },
        {
          jour: 'mardi',
          heureDebut: '08:00',
          heureFin: '16:00'
        },
        {
          jour: 'mercredi',
          heureDebut: '08:00',
          heureFin: '12:00'
        },
        {
          jour: 'jeudi',
          heureDebut: '08:00',
          heureFin: '16:00'
        },
        {
          jour: 'vendredi',
          heureDebut: '08:00',
          heureFin: '16:00'
        }
      ],
      IdProfessionnel: 12345,
      experience: [
        '15 ans d\'expérience en cardiologie interventionnelle',
        '8 ans comme chef de service au CHU Hassan II',
        '5 ans de formation en cardiologie pédiatrique à Paris',
        'Spécialiste en cathétérisme cardiaque et angioplastie'
      ],
      formation: [
        'Doctorat en Médecine - Université Mohammed V Rabat',
        'Spécialité en Cardiologie - CHU Ibn Rochd Casablanca',
        'Fellowship en Cardiologie Interventionnelle - Hôpital Bichat Paris',
        'Master en Cardiologie Pédiatrique - Université Paris Descartes'
      ],
      description: 'Cardiologue expérimentée spécialisée dans la cardiologie interventionnelle et pédiatrique. Forte de 15 ans d\'expérience, je prends en charge les pathologies cardiovasculaires complexes avec une approche personnalisée pour chaque patient.',
      adresse: 'CHU Hassan II, Route Sidi Harazem, Fès',
      role: 'medecin',
      verifie: true
    });

    // Doctor 2: Dr. Karim Alaoui - Neurologie (Clinique Al Madina - Casablanca)
    const doctor2 = new Medecin({
      code_SSO: 'AK001',
      cin: 'CD789012',
      nom: 'Alaoui',
      prenom: 'Karim',
      age: 38,
      mail: 'dr.karim.alaoui@almadina.ma',
      password: 'DocCasa2024!',
      telephone: '+212 522 27 68 45',
      specialite: 'Neurologie',
      sexe: 'homme',
      disponibilite: [
        {
          jour: 'lundi',
          heureDebut: '09:00',
          heureFin: '17:00'
        },
        {
          jour: 'mardi',
          heureDebut: '09:00',
          heureFin: '17:00'
        },
        {
          jour: 'mercredi',
          heureDebut: '14:00',
          heureFin: '20:00'
        },
        {
          jour: 'jeudi',
          heureDebut: '09:00',
          heureFin: '17:00'
        },
        {
          jour: 'samedi',
          heureDebut: '09:00',
          heureFin: '13:00'
        }
      ],
      IdProfessionnel: 67890,
      experience: [
        '12 ans d\'expérience en neurologie clinique',
        '6 ans comme neurologue senior à la Clinique Al Madina',
        '4 ans de recherche en neurosciences à l\'Institut Pasteur',
        'Spécialiste des troubles neurologiques et épilepsie'
      ],
      formation: [
        'Doctorat en Médecine - Université Hassan II Casablanca',
        'Spécialité en Neurologie - CHU Ibn Rochd Casablanca',
        'Master en Neurosciences - Université Mohammed VI Rabat',
        'Formation en Électroencéphalographie - Institut de Neurologie Londres'
      ],
      description: 'Neurologue spécialisé dans le diagnostic et le traitement des troubles du système nerveux. Expert en épilepsie, migraines, et maladies neurodégénératives. J\'offre une prise en charge complète avec les dernières technologies de diagnostic.',
      adresse: 'Clinique Al Madina, 85 Boulevard Zerktouni, Casablanca',
      role: 'medecin',
      verifie: true
    });

    // Save both doctors
    await doctor1.save();
    await doctor2.save();

    console.log('✅ Médecins de démonstration créés avec succès!');
    console.log('\n👨‍⚕️ DONNÉES DES MÉDECINS POUR LA DÉMONSTRATION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n🩺 MÉDECIN 1 (CHU Hassan II - Fès):');
    console.log('┌─────────────────────────────────────────────────────────────────────────┐');
    console.log('│                          Dr. Sarah BENALI                              │');
    console.log('├─────────────────────────────────────────────────────────────────────────┤');
    console.log(`│ 🆔 CIN: ${doctor1.cin}                                                    │`);
    console.log(`│ 📧 Email: ${doctor1.mail}                         │`);
    console.log(`│ 🏥 Code SSO: ${doctor1.code_SSO}                                                  │`);
    console.log(`│ 🔢 ID Professionnel: ${doctor1.IdProfessionnel}                                           │`);
    console.log(`│ 🩺 Spécialité: ${doctor1.specialite}                                            │`);
    console.log(`│ 👤 Âge: ${doctor1.age} ans                                                     │`);
    console.log(`│ 📞 Téléphone: ${doctor1.telephone}                                   │`);
    console.log(`│ 🔑 Mot de passe: DocFes2024!                                           │`);
    console.log(`│ ✅ Vérifié: ${doctor1.verifie ? 'Oui' : 'Non'}                                                    │`);
    console.log('└─────────────────────────────────────────────────────────────────────────┘');

    console.log('\n🧠 MÉDECIN 2 (Clinique Al Madina - Casablanca):');
    console.log('┌─────────────────────────────────────────────────────────────────────────┐');
    console.log('│                         Dr. Karim ALAOUI                               │');
    console.log('├─────────────────────────────────────────────────────────────────────────┤');
    console.log(`│ 🆔 CIN: ${doctor2.cin}                                                    │`);
    console.log(`│ 📧 Email: ${doctor2.mail}                          │`);
    console.log(`│ 🏥 Code SSO: ${doctor2.code_SSO}                                                  │`);
    console.log(`│ 🔢 ID Professionnel: ${doctor2.IdProfessionnel}                                           │`);
    console.log(`│ 🧠 Spécialité: ${doctor2.specialite}                                             │`);
    console.log(`│ 👤 Âge: ${doctor2.age} ans                                                     │`);
    console.log(`│ 📞 Téléphone: ${doctor2.telephone}                                   │`);
    console.log(`│ 🔑 Mot de passe: DocCasa2024!                                          │`);
    console.log(`│ ✅ Vérifié: ${doctor2.verifie ? 'Oui' : 'Non'}                                                    │`);
    console.log('└─────────────────────────────────────────────────────────────────────────┘');

    console.log('\n🔐 INFORMATIONS DE CONNEXION POUR LA DÉMONSTRATION:');
    console.log('┌─────────────────────────────────────────────────────────────────────────┐');
    console.log('│                        CONNEXIONS MÉDECINS                             │');
    console.log('├─────────────────────────────────────────────────────────────────────────┤');
    console.log('│ Dr. Sarah Benali (Cardiologue):                                        │');
    console.log('│   📧 dr.sarah.benali@chu-fes.ma                                        │');
    console.log('│   🔑 DocFes2024!                                                        │');
    console.log('│                                                                         │');
    console.log('│ Dr. Karim Alaoui (Neurologue):                                         │');
    console.log('│   📧 dr.karim.alaoui@almadina.ma                                       │');
    console.log('│   🔑 DocCasa2024!                                                       │');
    console.log('└─────────────────────────────────────────────────────────────────────────┘');

    console.log('\n⏰ HORAIRES DE DISPONIBILITÉ:');
    console.log('┌─────────────────────────────────────────────────────────────────────────┐');
    console.log('│ Dr. Sarah Benali (Cardiologue):                                        │');
    console.log('│   Lundi à Vendredi: 08:00 - 16:00 (Mercredi: 08:00 - 12:00)           │');
    console.log('│                                                                         │');
    console.log('│ Dr. Karim Alaoui (Neurologue):                                         │');
    console.log('│   Lun-Mar-Jeu: 09:00 - 17:00 | Mer: 14:00 - 20:00 | Sam: 09:00-13:00 │');
    console.log('└─────────────────────────────────────────────────────────────────────────┘');

    // Verification
    const totalDoctors = await Medecin.countDocuments();
    console.log('\n✅ VÉRIFICATION FINALE:');
    console.log(`   👨‍⚕️ ${totalDoctors} médecins en base de données`);
    console.log(`   🏥 Répartis dans ${new Set([doctor1.code_SSO, doctor2.code_SSO]).size} cliniques`);
    
    console.log('\n🎬 MÉDECINS PRÊTS POUR LA DÉMONSTRATION!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 Conseil: Utilisez ces comptes pour montrer les fonctionnalités médecin');
    console.log('💡 Les deux médecins sont vérifiés et ont des horaires différents');

  } catch (err) {
    console.error('❌ Erreur lors de la création des médecins:', err);
  } finally {
    mongoose.connection.close();
  }
};

addTestDoctors();
