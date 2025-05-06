// models/Problem.js
const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role:      { type: String, enum: ['Patient','medecin','Admin'], required: true },
  code_sso:  { type: String, required: true },
  message:   { type: String, required: true },
  solved:    { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'Problems' });

module.exports = mongoose.model('Problem', problemSchema);
