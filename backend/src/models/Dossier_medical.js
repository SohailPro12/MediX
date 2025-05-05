// models/DossierMedical.js
const mongoose = require('mongoose');

const dossierMedicalSchema = new mongoose.Schema({
  numero:         { type: String, required: true },
  PatientId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  dateCreation:   { type: Date, required: true },
  dateModification: { type: Date, required: true },
  analyses:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Analyse' }],
  traitemant:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Traitement' }],
  ordonnances:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ordonnance' }],
}, { collection: 'DossierMedical' });

module.exports = mongoose.model('DossierMedical', dossierMedicalSchema);
