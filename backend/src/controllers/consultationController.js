// controllers/AdminconsultationController.js
const RendezVous = require('../models/Rendez-vous');

// controllers/AdminconsultationController.js
exports.getConsultationsByDate = async (req, res) => {
  console.log('Controller reached for date:', req.params.date);
  try {
    const { date } = req.params;
    const { code_SSO } = req.user; // From JWT via authMiddleware

    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    console.log('Query range:', {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      code_SSO
    });

    const consultations = await RendezVous.find({
      date: {
        $gte: startDate,
        $lte: endDate
      },
      code_SSO // Filter by code_SSO
    })
      .populate('PatientId', 'name')
      .populate('MedecinId', 'name');

    console.log('Found consultations:', consultations);
    res.json(consultations);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

