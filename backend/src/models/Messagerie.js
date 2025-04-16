const mongoose = require('mongoose');

const SchemaMessagerie = new mongoose.Schema({
  Id : { type: String, required: true },
  expiditeur : { type: String, required: true },
  destinataire : { type: String, required: true },
  date : { type: Date },
  Etat : { type: String },
  message : { type: String },
  pieces_jointes: [{ type: String }],
  images: [{ type: buffer}]
}, { collection: 'Messagerie' });


const Messagerie = mongoose.model('Messagerie', SchemaMessagerie);
module.exports = Messagerie;
