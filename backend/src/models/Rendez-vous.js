const mongoose = require('mongoose');
const Patient = require('./Patient');
const Medecin = require('./Medecin');

const SchemaRendezVous = new mongoose.Schema({
  PatientId : { type: mongoose.Schema.Types.ObjectId, ref:Patient},
  MedecinId : { type: mongoose.Schema.Types.ObjectId, ref:Medecin},
  date : { type: Date, required: true },
  lieu : { type: String, required: true },
  observation: { type: String }
}, { collection: 'Rendez-vous' });


const RendezVous = mongoose.model('RendezVous', SchemaRendezVous);
module.exports = RendezVous;
