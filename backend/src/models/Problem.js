const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['Patient', 'Médecin', 'Admin'], required: true },
  message: { type: String, required: true },
  solved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'Problems' });

module.exports = mongoose.model('Problem', problemSchema);