const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
require('dotenv').config();

const ConnexionAdmin = require('./models/ConnexionAdmin'); // Importer le modèle

const app = express();
const port = process.env.PORT || 3001; // Utiliser un port défini dans les variables d'environnement ou 3001 par défaut

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text({ type: '*/*' })); // Accepter tout type de données pour le débogage
app.use(helmet());
app.use(morgan('combined'));

// Connexion à MongoDB Atlas
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000, // Timeout de 5 secondes
})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err.message);
    process.exit(1); // Arrêter le serveur en cas d'échec de connexion
  });

// Routes
app.post('/login', async (req, res) => {
  console.log('Données brutes reçues:', req.body); // Afficher les données brutes

  let data;
  try {
    if (typeof req.body === 'string') {
      data = JSON.parse(req.body); // Parser manuellement si les données sont une chaîne
    } else {
      data = req.body; // Utiliser directement si c'est déjà un objet
    }

    const { mail, password } = data;
    console.log('Password:', password); // Log du mot de passe

    if (!mail || !password) {
      return res.status(400).json({ message: 'Mail et mot de passe requis' });
    }

    // Recherche insensible à la casse
    const admin = await ConnexionAdmin.findOne({ mail: new RegExp(`^${mail}$`, 'i') });
    console.log('Admin trouvé:', admin); // Log de l'admin trouvé

    if (!admin) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    const match = await bcrypt.compare(password, admin.password);
    console.log('Mot de passe haché:', admin.password); // Log du mot de passe haché
    console.log('Mot de passe fourni:', password); // Log du mot de passe fourni
    console.log('Correspondance des mots de passe:', match); // Log de la correspondance des mots de passe

    if (!match) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Connexion réussie', token });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
