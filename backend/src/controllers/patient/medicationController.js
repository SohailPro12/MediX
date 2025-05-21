const Traitement = require('../../models/Traitement');
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const PERIOD_TIMES = {
  'Matin':      { hour: 8,  minute: 0 },
  'Midi':       { hour:12,  minute: 0 },
  'Après-midi': { hour:16,  minute: 0 },
  'Soir':       { hour:20,  minute: 0 },
};

exports.getPlan = async (req, res) => {
  try {
    const patientId = req.user.id;
    const today = new Date();

    const traitements = await Traitement.find({
      PatientId: patientId,
      dateFin: { $gte: today }
    }).lean();

    const meds = [];

    for (const traitement of traitements) {
      const daysLeft = Math.ceil((new Date(traitement.dateFin) - today) / MS_PER_DAY);

      for (const m of traitement.medicaments) {
        if (!m.periods || !Array.isArray(m.periods)) continue;

        m.periods.forEach(period => {
          const tm = PERIOD_TIMES[period];
          if (!tm) return;

          meds.push({
            id: `${traitement._id}-${m.nom}-${period}`,
            name: m.nom,
            dosage: m.dosage,
            period,
            instructions: `${m.nom} — ${period}`,
            duration: `${daysLeft} jour${daysLeft > 1 ? 's' : ''}`,
            hour: tm.hour,
            minute: tm.minute,
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            icon: '💊'
          });
        });
      }
    }
console.log(meds);
    res.json(meds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur interne' });
  }
};
