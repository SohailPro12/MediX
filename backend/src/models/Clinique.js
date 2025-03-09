const mongoose = require('mongoose');

const SchemaClinique = new mongoose.Schema({
  code_SSO: { type: String, required: true },
  Nom: { type: String, required: true },
  adresse: { type: String, required: true },
  telephone: { type: String, required: true },
  mail: { type: String, required: true },
  logo: { type: Buffer }

}, { collection: 'Clinique' });


const Clinique = mongoose.model('Clinique', SchemaClinique);
module.exports = Clinique;
