// controllers/doctor/uploadImage.js
const cloudinary = require('../../config/cloudinary');
const fs = require('fs');
const Medecin = require('../../models/Medecin');

exports.uploadDoctorImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucune image envoyée." });
  }
  try {
    const doctorId = req.user.id;
    const doctor = await Medecin.findById(doctorId);
    if (!doctor) return res.status(404).json({ error: "Médecin introuvable." });

    // Build Cloudinary folder/name
    const folderPath = `medix/Doctors/${doctor.code_SSO}`;
    const publicId   = `${doctor.nom}-${doctor._id}`;

    // Optionally delete old image
    if (doctor.Photo && doctor.Photo.includes('cloudinary')) {
      const oldId = doctor.Photo.match(/\/([^\/]+)\.[^\.]+$/)[1];
      await cloudinary.uploader.destroy(`${folderPath}/${oldId}`);
    }

    // Upload new
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderPath,
      public_id: publicId,
      overwrite: true
    });

    // remove temp file
    fs.unlinkSync(req.file.path);

    // save URL on doctor
    doctor.Photo = result.secure_url;
    await doctor.save();

    res.json({ message: "Photo mise à jour", imageUrl: result.secure_url });
  } catch (err) {
    console.error("Erreur upload doctor image:", err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};
