require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/Login");
const errorMiddleware = require("./middleware/error");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: "*/*" })); // Debugging

// Connexion à MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Middleware de gestion des erreurs
app.use(errorMiddleware);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${port}`);
});
