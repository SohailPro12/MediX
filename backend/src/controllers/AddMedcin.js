const jwt = require("jsonwebtoken");
const Medecin = require("../models/Medecin");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.addMedecin = async (req, res) => {
  try {
    const data = req.body;

    // 1. check existing doctor
    if (await Medecin.findOne({ mail: data.mail })) {
      return res.status(400).json({ message: "Email déjà utilisé." });
    }

    // 2. create new doctor instance (not saved yet)
    const newDoctor = new Medecin({
      code_SSO: data.codeSSO,
      nom: data.nom,
      prenom: data.prenom,
      cin: data.cin,
      mail: data.mail,
      telephone: data.phone,
      specialite: data.specialty,
      IdProfessionnel: data.licenseNumber,
      password: data.password,
      verifie: false
    });

    // 3. if image file provided, upload to Cloudinary
    if (req.file) {
      const folder = `medix/Doctors/${newDoctor.code_SSO}`;
      const pubId = `${newDoctor.nom}-${Date.now()}`;
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder,
        public_id: pubId,
        overwrite: true
      });
      // assign secure URL and cleanup
      newDoctor.Photo = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    // 4. save doctor
    await newDoctor.save();

    // 5. generate JWT and send verification email
    const token = jwt.sign({ id: newDoctor._id, role: 'medecin' }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const deepLink = `medix://add_Medecin/${token}`;
    const emailContent = `
      <p>Bonjour ${newDoctor.nom},</p>
      <p>Veuillez vérifier votre email en cliquant <a href="${deepLink}">ici</a>.</p>
      <p>${deepLink}</p>
      <p>Si ce n'est pas vous, ignorez.</p>
    `;
    await sendEmail(newDoctor.mail, "Création du compte", emailContent);

    return res.status(201).json({
      message: "Compte médecin créé avec succès. Email de vérification envoyé.",
      doctorId: newDoctor._id,
      doctorSSO: newDoctor.code_SSO
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur." });
  }
};
