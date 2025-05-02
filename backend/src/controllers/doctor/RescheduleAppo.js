const Appointment = require('../../models/Rendez-vous'); 

exports.rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentId, newDateTime } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { date: newDateTime },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la replanification' });
  }
};
