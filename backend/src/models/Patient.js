const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const DossierMedical = require('./Dossier_medical');
const Clinique = require('./Clinique');

const PatientSchema = new mongoose.Schema({
  code_SSO: { type: String, ref: 'Clinique',required: true },
  id_medecin: { type: mongoose.Schema.Types.ObjectId, ref: 'Medecin' },
  cin: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  age: { type: Number },
  sexe: { type: String },
  mail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telephone: { type: String, required: true },
  adresse: { type: String},
  role: { type: String, enum: ["patient"], default: "patient" },
  dossierMedicalId: { type: String, ref: 'DossierMedical' },
  photo: { type: Buffer }
}, { collection: 'patient', timestamps: true });

PatientSchema.pre('save', async function (next) {
  const clinique = await Clinique.findOne({ code_SSO: this.code_SSO });
  if (!clinique) {
    return next(new Error('Code clinique invalide'));
  }
  next();
});
// 🔹 Hashage du mot de passe avant sauvegarde
PatientSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const Patient = mongoose.model('Patient', PatientSchema);
module.exports = Patient;
