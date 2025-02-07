const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  mail: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { collection: 'admin' });

// 🔹 Hashage du mot de passe avant sauvegarde
adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const ConnexionAdmin = mongoose.model('ConnexionAdmin', adminSchema);
module.exports = ConnexionAdmin;
