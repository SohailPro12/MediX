const Admin = require("../models/Admin");
const Medecin = require("../models/Medecin");
const Patient = require("../models/Patient");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

exports.forgotPassword = async (req, res) => {
  try {
    if (typeof req.body === "string") {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }

    const { mail, role, sso } = data;
    console.log("Mail:", mail, "Role:", role, "SSO:", sso);


    if (!mail) {
      return res.status(400).json({ message: "Email requis" });
    }

    let userModel;
    if (role === "admin") {
      userModel = Admin;
    } else if (role === "medecin") {
      userModel = Medecin;
    } else if (role === "patient") {
      userModel = Patient;
    } else {
      return res.status(400).json({ message: "Rôle invalide" });
    }


    const user =await userModel.findOne({ mail: new RegExp(`^${mail}$`, "i") });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    if (user.code_SSO !== String(sso)) {
      return res.status(403).json({ message: "Accès refusé : Code SSO invalide" });
    }


    // Créer un token JWT si l'utilisateur existe
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });


    const deepLink = `medix://reset-password/${token}`;

    const emailContent = `
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <p>Si vous utilisez un mobile, ouvrez directement l'application avec ce lien :</p>
      <p>${deepLink}</p>
      <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
    `;

    await sendEmail(user.mail, "Réinitialisation de mot de passe", emailContent);

    res.json({ message: "Email de réinitialisation envoyé !" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
