// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Clinique = require('./Clinique');

const adminSchema = new mongoose.Schema({
  code_SSO: { type: String, required: true },
  role: { type: String, required: true, enum: ["admin"], default: "admin" },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  cin: { type: String, required: true, unique: true },
  mail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telephone: { type: String, required: true },
  image: { type: mongoose.Mixed } // Allow Buffer or String
}, { collection: 'admin', timestamps: true });

adminSchema.pre('save', async function (next) {
  const clinique = await Clinique.findOne({ code_SSO: this.code_SSO });
  if (!clinique) {
    return next(new Error('Code clinique invalide'));
  }
  next();
});

adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;