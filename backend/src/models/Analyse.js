const mongoose = require('mongoose');
const Patient = require('./Patient');

const SchemaAnalyse = new mongoose.Schema({
  id : { type: String, required: true },
  PatientId : { type: mongoose.Schema.Types.ObjectId, ref:'Patient'},
  date : { type: Date, required: true },
  laboratoire:{
    nom: { type: String  },
    adresse: { type: String },
    telephone: {type: String },
    email: {type: String }
  },
  observation: { type: String },
  pdfs: [{ type: String }]
}, { collection: 'Analyse' });


const Analyse = mongoose.model('Analyse', SchemaAnalyse);
module.exports = Analyse;
