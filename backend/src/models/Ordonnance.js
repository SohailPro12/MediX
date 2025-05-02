const mongoose = require('mongoose');

const SchemaOrdonnance = new mongoose.Schema({
  PatientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  MedecinId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medecin', required: true },
  natureMaladie: { type: String, required: true },
  date: { type: Date, required: true },
  analyses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Analyse' }], // références vers Analyse
  traitement: { type: mongoose.Schema.Types.ObjectId, ref: 'Traitement' }, // une seule référence vers Traitement
  medicaments: [
    {
      name: { type: String, required: true },
      endDate: { type: Date, required: true },
      periods: [{ type: String, enum: ['Matin', 'Midi', 'Après-midi', 'Soir'] }],
    }
  ],
}, { collection: 'Ordonnances' });

const Ordonnance = mongoose.model('Ordonnance', SchemaOrdonnance);
module.exports = Ordonnance;
