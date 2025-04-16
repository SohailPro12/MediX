import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, SafeAreaView } from 'react-native';
import Header from '../../components/DoctorComponents/Header';
const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [weekNumber, setWeekNumber] = useState('');
  const [appointments, setAppointments] = useState([]);

  const timeSlots = ['Matinée', 'Midi', 'Après-midi', 'Soir'];

  useEffect(() => {
    const generateWeekDays = () => {
      const days = [];
      const currentDate = new Date(selectedDate);
      const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));

      for (let i = 0; i < 7; i++) {
        const date = new Date(firstDayOfWeek);
        date.setDate(firstDayOfWeek.getDate() + i);
        const dayName = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i];
        days.push({ date, label: `${dayName} ${date.getDate()}` });
      }

      setWeekDays(days);
      setWeekNumber(getWeekNumber(days[0].date));
      fetchAppointments(days);
    };

    generateWeekDays();
  }, [selectedDate]);

  const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const daysPassed = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((daysPassed + startOfYear.getDay() + 1) / 7);
  };

  const fetchAppointments = (days) => {
    const dummy = [
      { id: 1, title: 'Consultation Générale', date: days[6].date, timeSlot: 0 },
      { id: 2, title: 'Suivi Médical', date: days[6].date, timeSlot: 3 },
      { id: 3, title: 'Test Laboratoire', date: days[0].date, timeSlot: 2 },
      { id: 4, title: 'Consultation Cardiologie', date: days[3].date, timeSlot: 2 },
      { id: 5, title: 'Consultation Psychologue', date: days[3].date, timeSlot: 3 },
      { id: 6, title: 'Examen Radiologique', date: days[3].date, timeSlot: 1 },
    ];
    setAppointments(dummy);
  };
  

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };

  const getMonthYear = () => {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  };

  const getAppointment = (dayIndex, timeSlot) => {
    const target = weekDays[dayIndex]?.date;
    if (!target) return null;
    return appointments.find(appt =>
      appt.date.getDate() === target.getDate() &&
      appt.date.getMonth() === target.getMonth() &&
      appt.date.getFullYear() === target.getFullYear() &&
      appt.timeSlot === timeSlot
    );
  };

  const addAppointment = (dayIndex, timeSlot) => {
    const newAppt = {
      id: appointments.length + 1,
      title: 'Nouveau RDV',
      date: weekDays[dayIndex].date,
      timeSlot,
    };
    setAppointments([...appointments, newAppt]);
  };
  return (
    <SafeAreaView style={styles.container}>
      {/*<Text style={styles.header}>Calendrier</Text>*/}
      <Header name="Calendrier" marginl={"13%"} marginlc={"16%"} screen="DashboardDoctor"/>
      <View style={styles.calendarContainer}>
        <Text style={styles.title}>Table Rendez-vous</Text>
        
{/*les fleches pour naviger les semaines*/}
        <View style={styles.monthSelector}>
          
          <TouchableOpacity style={styles.arrow} onPress={() => navigateWeek(-1)}>
            <Text style={styles.arrowText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.month}>{getMonthYear()}</Text>
          <TouchableOpacity style={styles.arrow} onPress={() => navigateWeek(1)}>
            <Text style={styles.arrowText}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.weekText}>Semaine {weekNumber}</Text>
 {/*les jours*/}
        <View style={styles.daysHeader}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.dayText}>{day.label}</Text>
          ))}
        </View>
 {/*calender */}
        
          {timeSlots.map((slot, timeIndex) => (
            <View key={timeIndex} style={styles.timeRow}>
              <View style={styles.timeSlot}>
                <Text style={styles.timeText}>{slot}</Text>
              </View>
              {[...Array(7).keys()].map((dayIndex) => {
                const appt = getAppointment(dayIndex, timeIndex);
                return (
                  <TouchableOpacity
                    key={dayIndex}
                    style={styles.cell}
                    onPress={() => addAppointment(dayIndex, timeIndex)}
                  >
                    {appt ? (
                      <View style={styles.appointment}>
                        <Text style={styles.appointmentText}>{appt.title}</Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
   
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' ,paddingTop:45 ,padding:'3%'},
  calendarContainer: { flex: 1, margin: 2, borderWidth: 1, borderColor: '#4287f5', borderRadius: 5,marginTop:25},
  title: { fontSize: 16, fontWeight: 'bold', padding: 10, color: '#4287f5' },
  monthSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  arrow: { padding: 10 },
  arrowText: { fontSize: 20, fontWeight: 'bold' },
  month: { fontSize: 16 },
  weekText: { fontSize: 14, paddingLeft: 10, paddingVertical: 5 },
  daysHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  dayText: { flex: 1, textAlign: 'center', paddingVertical: 5, fontSize: 12 },
  timeRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', height: 80 },
  timeSlot: { width: 50, justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#eee', paddingLeft: 5 },
  timeText: { fontSize: 12 },
  cell: { flex: 1, height: 80, borderRightWidth: 1, borderRightColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  appointment: { backgroundColor: '#4287f5', width: '100%', height: '96%', borderRadius: 3, justifyContent: 'center', alignItems: 'center' },
  appointmentText: { color: 'white', fontSize: 10, textAlign: 'center' },
});

export default AppointmentCalendar;
