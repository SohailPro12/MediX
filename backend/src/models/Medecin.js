const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Clinique = require('./Clinique');

const medecinSchema = new mongoose.Schema({
  code_SSO: { type: String, ref:'Clinique', required: true },
  cin : { type: String, required: true, unique: true },
  nom : { type: String, required: true },
  prenom : { type: String, required: true },
  age : { type: Number, required: false },
  mail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telephone: { type: String, required: true },
  specialite: { type: String, required: true },
  sexe: { type: String, required: false },
  disponibilite: [{
    jour: { type: String, required: false },
    heureDebut: { type: String, required: false },
    heureFin: { type: String, required: false }
  }],
  IdProfessionnel: {type: Number, required: true},
  experience: [{ type: String, required: false }],
  formation: [{ type: String, required: false }],
  description: { type: String, required: false },
  adresse: { type: String, required: false },
  role: { type: String, required: true, enum: ["medecin"], default: "medecin" },
  Photo: { type: String },
  verifie: { type: Boolean, default: false }
}, { collection: 'medecin', timestamps: true });




medecinSchema.pre('save', async function (next) {
  const clinique = await Clinique.findOne({ code_SSO: this.code_SSO });
  if (!clinique) {
    return next(new Error('Code clinique invalide'));
  }
  next();
});



// 🔹 Hashage du mot de passe avant sauvegarde
medecinSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});


const Medecin = mongoose.model('Medecin', medecinSchema);
module.exports = Medecin;
