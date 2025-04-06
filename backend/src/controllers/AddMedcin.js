const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Medecin = require("../models/Medecin");
const sendEmail = require("../utils/sendEmail");

exports.addMedecin = async (req, res) => {
  console.log("Données reçues:", req.body);
  const data = req.body;
  let photoBase64 = null;

  try {
    // Vérifier si le médecin existe déjà
    const existingDoctor = await Medecin.findOne({ mail: data.mail });
    if (existingDoctor) {
      return res.status(400).json({ message: "Un compte avec cet email existe déjà" });
    }
    

    console.log("Ajout du médecin:", data.nom);

   

    // Création du médecin
    const newDoctor = new Medecin({
      code_SSO: data.codeSSO,
      nom: data.nom,
      prenom: data.prenom,
      cin: data.cin,
      mail: data.mail,
      telephone: data.phone,
      specialite: data.specialty,
      IdProfessionnel: data.licenseNumber,
      password: await bcrypt.hash(data.password, 10),
      Photo: data.photo,
      verifie: false,
    });

    // Génération du token JWT sécurisé
    const token = jwt.sign({ id: newDoctor._id, role: 'medecin' }, process.env.JWT_SECRET, { expiresIn: "15m" });
    console.log(token);

    // Lien de vérification
    const deepLink = `medix://add_Medecin/${token}`;

    // Contenu de l'email
    const emailContent = `
      <p>Bonjour ${data.nom},</p>
      <p>Veuillez cliquer sur le lien suivant pour vérifier votre adresse email :</p>
      <a href="${deepLink}">Vérifier l'email</a>
      <p>${deepLink}</p>
      <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
    `;

    // Envoi de l'email
    await sendEmail(data.mail, "Création du compte", emailContent);

    // Sauvegarde du médecin
    await newDoctor.save();
    
    res.status(201).json({ message: "Compte médecin créé avec succès. Veuillez vérifier votre email." });
  } catch (error) {
    console.error("Erreur lors de l'ajout du médecin:", error);
    res.status(500).json({ error: "Erreur interne du serveur. Veuillez réessayer plus tard." });
  }
};
