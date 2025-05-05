/* const mongoose = require('mongoose');
const Patient = require('./Patient');
const Medecin = require('./Medecin');

const SchemaConsultation = new mongoose.Schema({
  PatientId : { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  MedecinId : { type: mongoose.Schema.Types.ObjectId, ref: 'Medecin', required: true },
  date : { type: Date, required: true },
  lieu : { type: String, required: true },
  observation: { type: String },
  ordannance: [{ type: String }]
}, { collection: 'Consultation' });


const Consultation = mongoose.model('Consultation', SchemaConsultation);
module.exports = Consultation;
 */