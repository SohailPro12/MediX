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
/* const uploadRoutes = require("./routes/upload"); */
const problemRoutes = require('./routes/problemRoutes');
const doctorRoutes = require("./routes/doctor");
const reportingRoutes = require("./routes/reporting");
const patientRoutes = require("./routes/patient");

const app = express();
const port = process.env.PORT || 4000;

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
app.use("/api/admin", adminRoutes);
/* app.use("/api/upload", uploadRoutes); */
app.use('/api/problems', problemRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/reporting", reportingRoutes);
app.use("/api/patient", patientRoutes);
app.use('/api/conversations', require('./routes/conversationRoutes'));
app.use('/api/medications', require('./routes/medicationRoutes'));

// 📌 Middleware de gestion des erreurs
app.use(errorMiddleware);

// ✅ Démarrage du serveur
app.listen(port, () => {
  console.log(`✅ Serveur en ligne : http://localhost:${port}`);
});
