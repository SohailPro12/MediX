const mongoose = require('mongoose');
const Patient = require('./Patient');
/* const Consultation = require('./Consultation'); */
const Analyse = require('./Analyse');
const Traitement = require('./Traitement');

const dossierMedical = new mongoose.Schema({
  numero : { type: String, required: true },
  PatientId : { type: mongoose.Schema.Types.ObjectId, ref:'Patient'},
  dateCreation : { type: Date, required: true },
  dateModification : { type: Date, required: true },
/*   consultation: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Consultation' }], */
  analyses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Analyse' }],
  traitemant: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Traitement' }],
}, { collection: 'DossierMedical' });


const DossierMedical = mongoose.model('DossierMedical', dossierMedical);
module.exports = DossierMedical;
