
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();



const connectDB = async () => {
  try {
    await mongoose.connect( String(process.env.MONGODB_URI), {
      serverSelectionTimeoutMS: 5000, // Timeout de 5 secondes
    });
    console.log("✅ Connexion à MongoDB réussie !");
  } catch (err) {
    console.error("❌ Erreur de connexion à MongoDB:", err.message);
    process.exit(1); // Arrêter le serveur en cas d'échec
  }
};

module.exports = connectDB;
