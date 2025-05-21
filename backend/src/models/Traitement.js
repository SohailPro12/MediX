const mongoose = require('mongoose');

const SchemaTraitement = new mongoose.Schema({
  PatientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date },
  observation: { type: String },
  medicaments: [{
    nom: { type: String },
    dosage: { type: String },
    endDate: { type: Date },
    periods: [{ type: String, enum: ['Matin', 'Midi', 'Après-midi', 'Soir'] }]
  }]
}, { collection: 'Traitement' });

module.exports = mongoose.model('Traitement', SchemaTraitement);
