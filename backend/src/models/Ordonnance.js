const mongoose = require('mongoose');

const SchemaOrdonnance = new mongoose.Schema({
  PatientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  MedecinId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medecin', required: true },
  natureMaladie: { type: String, required: true },
  date: { type: Date, required: true },
  analyses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Analyse' }],
  traitement: { type: mongoose.Schema.Types.ObjectId, ref: 'Traitement' },
  RendezVousId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RendezVous',
    required: true
  }
}, { collection: 'Ordonnances' });

module.exports = mongoose.model('Ordonnance', SchemaOrdonnance);
