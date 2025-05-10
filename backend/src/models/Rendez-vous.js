const mongoose = require('mongoose');

const SchemaRendezVous = new mongoose.Schema({
  PatientId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  MedecinId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Medecin', required: true },
  date:        { type: Date, required: true, index: true },
  lieu:        { type: String, required: true },
  observation: { type: String },
  status:      { type: String, enum: ['pending', 'confirmed'], default: 'pending', index: true },
  motif:       { type: String },
  ordonnance:  { type: mongoose.Schema.Types.ObjectId, ref: 'Ordonnance', default: null },
  rating : { type: Number, min: 1,max: 5,default: null }
}, {
  collection: 'Rendez-vous',
  timestamps: true // ajoute createdAt / updatedAt
});

SchemaRendezVous.index({ date: 1 });
SchemaRendezVous.index({ status: 1 });

module.exports = mongoose.model('RendezVous', SchemaRendezVous);
