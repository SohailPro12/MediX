const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès refusé, token manquant ou mal formaté" });
  }

  const token = authHeader.split(" ")[1]; // Récupère uniquement le token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Stocke les infos du user
    next(); 
  } catch (error) {
    console.error("Erreur d'authentification :", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expiré, veuillez vous reconnecter" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Token invalide" });
    } else {
      return res.status(500).json({ message: "Erreur d'authentification" });
    }
  }
};

module.exports = authMiddleware;
