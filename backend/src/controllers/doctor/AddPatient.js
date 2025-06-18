const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Medecin = require("../../models/Patient");
const sendEmail = require("../../utils/sendEmail");
const Patient = require("../../models/Patient");
const DossierMedical = require("../../models/Dossier_medical");

exports.addPatient = async (req, res) => {
  console.log("Données reçues:", req.body);
  const data = req.body;

  try {
    // Vérifier si le médecin existe déjà
    const existingPatient = await Patient.findOne({ mail: data.mail });
    if (existingPatient) {
      return res.status(400).json({ message: "Un compte avec cet email existe déjà" });
    }
    

    console.log("Ajout du Patient:", data.nom);

   

    // Création du médecin
    const newPatient = new Patient({
      id_medecin: data.id_medecin,
      code_SSO: data.codeSSO,
      nom: data.nom,
      prenom: data.prenom,
      cin: data.cin,
      mail: data.mail,
      telephone: data.telephone,
      password: data.password,
      verifie: false,
    });

    // Génération du token JWT sécurisé
    const token = jwt.sign({ id: newPatient._id, role: 'patient' }, process.env.JWT_SECRET, { expiresIn: "15m" });
    console.log(token);

    // Lien de vérification
    const deepLink = `medix://add_Patient/${token}`;

    // Contenu de l'email
    const emailContent = `
      <p>Bonjour ${data.nom},</p>
      <p>Veuillez cliquer sur le lien suivant pour vérifier votre adresse email :</p>
      <a href="${deepLink}">Vérifier l'email</a>
      <p>${deepLink}</p>
      <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
    `;    // Envoi de l'email
    await sendEmail(data.mail, "Création du compte", emailContent);
    
    // Sauvegarde du patient
    await newPatient.save();
    console.log(`✅ Patient ${data.nom} sauvegardé avec l'ID: ${newPatient._id}`);
    
    // Création du dossier médical vide pour le nouveau patient
    try {      const newDossierMedical = new DossierMedical({
        numero: `DM-${newPatient._id.toString().slice(-8)}`, // Numéro unique basé sur l'ID patient
        PatientId: newPatient._id,
        dateCreation: new Date(),
        dateModification: new Date(),
        analyses: [],
        traitemant: [], // Note: keeping the same spelling as in the model
        ordonnances: []
      });
      
      await newDossierMedical.save();
      console.log(`✅ Dossier médical créé avec l'ID: ${newDossierMedical._id}`);
      
      // Mise à jour du patient avec l'ID du dossier médical
      newPatient.dossierMedicalId = newDossierMedical._id.toString();
      await newPatient.save();
      
      console.log(`✅ Dossier médical créé pour le patient ${data.nom} avec le numéro: ${newDossierMedical.numero}`);
    } catch (dossierError) {
      console.error("❌ Erreur lors de la création du dossier médical:", dossierError);
      // Le patient a été créé mais pas son dossier médical - on peut continuer
    }
    
    res.status(201).json({ message: "Compte Patient créé avec succès. Veuillez vérifier votre email." });
  } catch (error) {
    console.error("Erreur lors de l'ajout du Patient:", error);
    res.status(500).json({ error: "Erreur interne du serveur. Veuillez réessayer plus tard." });
  }
};
