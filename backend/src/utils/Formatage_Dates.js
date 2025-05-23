const joursAbreges = { 
  'lundi': 'lun', 'mardi': 'mar', 'mercredi': 'mer', 'jeudi': 'jeu',
  'vendredi': 'ven', 'samedi': 'sam', 'dimanche': 'dim'
};

function formatDateFR(date, options = {}) {
  return new Date(date).toLocaleDateString('fr-FR', options);
}

function formatTimeFR(date, options = {}) {
  return new Date(date).toLocaleTimeString('fr-FR', options);
}

function getFormattedDateInfo(date) {
  const dateObj = new Date(date);
  const jourComplet = formatDateFR(dateObj, { weekday: 'long' }).toLowerCase();
  const jourAbrege = joursAbreges[jourComplet];
  const dateStr = formatDateFR(dateObj, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = formatTimeFR(dateObj, { hour: '2-digit', minute: '2-digit' });
  return { jourAbrege, jourComplet, dateStr, timeStr };
}

module.exports = {
  formatDateFR,
  formatTimeFR,
  getFormattedDateInfo,
};
