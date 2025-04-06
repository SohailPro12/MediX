require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/error");

// Importation des routes
const authRoutes = require("./routes/login");
const adminRoutes = require("./routes/admin");
const uploadRoutes = require("./routes/upload");

const app = express();
const port = process.env.PORT || 3000;

// 📌 Connexion à MongoDB
connectDB();

// 📌 Middleware global
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// 📌 Routes
app.use("/api/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/upload", uploadRoutes);

// 📌 Middleware de gestion des erreurs
app.use(errorMiddleware);

// ✅ Démarrage du serveur
app.listen(port, () => {
  console.log(`✅ Serveur en ligne : http://localhost:${port}`);
});
