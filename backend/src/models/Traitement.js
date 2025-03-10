const mongoose = require('mongoose');
const Patient = require('./Patient');

const SchemaTraitement = new mongoose.Schema({
  PatientId : { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  dateDebut : { type: Date, required: true },
  dateFin : { type: Date },
  medicaments: [{
  nom: { type: String  },
  dosage: { type: String }
    }],
    observation: { type: String }
}, { collection: 'Traitement' });


const Traitement = mongoose.model('Traitement', SchemaTraitement);
module.exports = Traitement;
