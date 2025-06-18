// controllers/patient/uploadImage.js
const cloudinary = require('../../config/cloudinary');
const fs = require('fs');
const Patient = require('../../models/Patient');

exports.uploadPatientImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucune image envoyée." });
  }
  
  try {
    const patientId = req.user.id;
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient introuvable." });
    }

    // Build Cloudinary folder/name
    const folderPath = `medix/Patients/${patient.code_SSO}`;
    const publicId = `${patient.nom}-${patient._id}`;

    // Optionally delete old image if it exists
    if (patient.photo && patient.photo.includes('cloudinary')) {
      try {
        const oldId = patient.photo.match(/\/([^\/]+)\.[^\.]+$/)[1];
        await cloudinary.uploader.destroy(`${folderPath}/${oldId}`);
      } catch (err) {
        console.log("Warning: Could not delete old image:", err.message);
      }
    }

    // Upload new image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderPath,
      public_id: publicId,
      overwrite: true,
      transformation: [
        { width: 500, height: 500, crop: "fill", gravity: "face" },
        { quality: "auto", fetch_format: "auto" }
      ]
    });

    // Remove temporary file
    fs.unlinkSync(req.file.path);

    // Save URL to patient record
    patient.photo = result.secure_url;
    await patient.save();

    res.json({ 
      message: "Photo de profil mise à jour avec succès", 
      imageUrl: result.secure_url 
    });

  } catch (err) {
    console.error("Erreur upload patient image:", err);
    
    // Clean up temp file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.error("Error cleaning up temp file:", cleanupErr);
      }
    }
    
    res.status(500).json({ 
      error: "Erreur lors du téléchargement de l'image", 
      details: err.message 
    });
  }
};
