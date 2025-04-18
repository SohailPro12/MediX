const Admin = require("../models/Admin");
const Medecin = require("../models/Medecin");
const Patient = require("../models/Patient");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/creationTocken");

exports.login = async (req, res) => {
  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { mail, password, role, sso } = data;

    console.log("🔐 Tentative de connexion:", { mail, role, sso });

    if (!mail || !password || !role || !sso) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    let userModel;
    if (role === "admin") userModel = Admin;
    else if (role === "medecin") userModel = Medecin;
    else if (role === "patient") userModel = Patient;
    else return res.status(400).json({ message: "Rôle invalide." });

    // Recherche avec email insensible à la casse + SSO
    const user = await userModel.findOne({
      mail: new RegExp(`^${mail}$`, "i"),
      code_SSO: String(sso),
    });

    if (!user) {
      return res.status(400).json({ message: "Aucun utilisateur trouvé avec ces informations." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Mot de passe incorrect." });
    }

    const token = generateToken(user);

    console.log("✅ Connexion réussie pour:", user.nom, user.prenom);

    res.json({
      message: "Connexion réussie",
      token,
      role,
      userId: user._id,
      nom: user.nom,
      prenom: user.prenom,
      photo: user.Photo || null,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la connexion:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
