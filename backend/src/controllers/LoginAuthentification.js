// controllers/LoginAuthentification.js
const Admin = require("../models/Admin");
const Medecin = require("../models/Medecin");
const Patient = require("../models/Patient");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/creationTocken");

exports.login = async (req, res) => {
  console.log("Données reçues:", req.body);

  let data;
  try {
    if (typeof req.body === "string") {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }

    const { mail, password, role, sso } = data;
    console.log("Mail:", mail, "Role:", role, "SSO:", sso);

    if (!mail || !password || !role || !sso) {
      return res.status(400).json({ message: "Mail, mot de passe, rôle et SSO requis" });
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

    const user = await userModel.findOne({ mail: new RegExp(`^${mail}$`, "i") });
    console.log("Utilisateur trouvé:", user);

    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    if (user.code_SSO !== String(sso)) {
      return res.status(403).json({ message: "Accès refusé : Code SSO invalide" });
    }

    const token = generateToken(user);
    console.log("Generated token:", token); // Debug token
    res.json({ message: "Connexion réussie", token, role, userId: user._id });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};