const mongoose = require("mongoose");
const Patient = require("./src/models/Patient");
const DossierMedical = require("./src/models/Dossier_medical");

const uri =
  "mongodb+srv://MediX:MediX@medix.55owr.mongodb.net/MediX?retryWrites=true&w=majority&appName=MediX";

mongoose
  .connect(uri)
  .then(() => console.log("✅ Connexion à MongoDB réussie"))
  .catch((err) => console.error("❌ Erreur de connexion:", err));

const addPatient = async () => {
  try {
    const pat = new Patient({
      code_SSO: "1",
      cin: "A12345",
      nom: "Bou",
      prenom: "anass",
      age: 30,
      sexe: "homme",
      mail: "Anass@patient.com",
      password: "patient",
      telephone: "0535567890",
      adresse: "Fes",
      role: "patient",
    });
    await pat.save();
    console.log("✅ Nouveau patient créé");

    // Création du dossier médical vide pour le nouveau patient
    const newDossierMedical = new DossierMedical({
      numero: `DM-${pat._id.toString().slice(-8)}`,
      PatientId: pat._id,
      dateCreation: new Date(),
      dateModification: new Date(),
      analyses: [],
      traitemant: [],
      ordonnances: [],
    });

    await newDossierMedical.save();

    // Mise à jour du patient avec l'ID du dossier médical
    pat.dossierMedicalId = newDossierMedical._id.toString();
    await pat.save();

    console.log(
      `✅ Dossier médical créé avec le numéro: ${newDossierMedical.numero}`
    );
    console.log({
      mail: pat.mail,
    });

    // Vérification finale après récupération de la base de données
    const adminSauvegardée = await Patient.findOne({ mail: pat.mail });
    console.log("patient sauvegardée:", adminSauvegardée);

    if (adminSauvegardée) {
      console.log("✅ Vérification finale réussie");
    } else {
      console.log("❌ patient non trouvée après sauvegarde");
    }
  } catch (err) {
    console.error("❌ Erreur:", err);
  } finally {
    mongoose.connection.close();
  }
};

addPatient();
