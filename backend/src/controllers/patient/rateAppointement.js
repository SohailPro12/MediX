const Appointment = require("../../models/Rendez-vous");

exports.rateAppointment = async (req, res) => {
  try {
    const { appointmentId, rating } = req.body;

    if (!appointmentId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Données invalides" });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { rating },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Rendez-vous non trouvé" });
    }

    res.json({ message: "Note enregistrée avec succès", appointment: updatedAppointment });
  } catch (error) {
    console.error("Erreur lors de la notation du rendez-vous:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
