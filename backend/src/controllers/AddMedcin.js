const bcrypt = require('bcrypt');
const Medecin = require("../models/Medecin");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");


exports.AddMedcin = async (req, res) => {
    console.log("Données reçues:", req.body);
  
    let data;
    data = req.body;
  
    if (!data.code_SSO || !data.nom || !data.prenom || !data.cin || !data.mail || !data.password) {
      return res.status(400).send('Code SSO, nom, prénom, CIN, email et mot de passe requis');
    }
  
    try {
      const existingDoctor = await Medecin.findOne({ mail:data.mail });
      if (existingDoctor) {
        return res.status(400).send('Un compte avec cet email existe déjà');
      }
  
      const newDoctor = new Medecin({
        code_SSO: data.code_SSO,
        nom: data.nom,  
        prenom: data.prenom,
        cin: data.cin,
        mail: data.mail,
        password: await bcrypt.hash(data.password, 10),
        verifie: false,
      });
      const token = jwt.sign({ id: newDoctor._id, role: "medecin" }, process.env.JWT_SECRET, { expiresIn: "15m" });


      const deepLink = `medix://add_Medecin/${token}`;
  
      const emailContent = `
        <p>Bonjour ${data.nom},</p>
      <p>Veuillez cliquer sur le lien suivant pour vérifier votre adresse email :</p>
      <a href="${deepLink}">Vérifier l'email</a>
      <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
    `;
  
      await sendEmail(data.mail, "Creation du compte", emailContent);
  
  
      await newDoctor.save();
      res.status(201).send('Compte médecin créé avec succès');
    } catch (error) {
      res.status(500).send('Erreur serveur');
    }
  };