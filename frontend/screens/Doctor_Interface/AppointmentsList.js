import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import CustomAlert from '../../components/DoctorComponents/CustomAlert';
import Header from '../../components/DoctorComponents/Header';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([
    { id: '1', patientName: 'Marie Dffubois', date: '31 Mars 2025', time: '09:30', type: 'Consultation', accepted: false },
    { id: '2', patientName: 'Jean Martin', date: '31 Mars 2025', time: '11:00', type: 'Examen', accepted: false },
    { id: '3', patientName: 'Sophie Laurent', date: '1 Avril 2025', time: '14:15', type: 'Consultation', accepted: false },
    { id: '4', patientName: 'Pierre Moreau', date: '2 Avril 2025', time: '10:30', type: 'Suivi', accepted: false },
    { id: '5', patientName: 'Pierre Moreau', date: '2 Avril 2025', time: '10:30', type: 'Suivi', accepted: false },
    { id: '6', patientName: 'Pierre Moreau', date: '2 Avril 2025', time: '10:30', type: 'Suivi', accepted: false },
  ]);

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const [confirmAlertVisible, setConfirmAlertVisible] = useState(false);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [rescheduleSuccessAlertVisible, setRescheduleSuccessAlertVisible] = useState(false);

  const availableTimes = ['08:00', '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '16:00', '16:30'];

  const handleAccept = (item) => {
    setSelectedAppointment(item);
    setConfirmAlertVisible(true);
  };

  const confirmAppointment = () => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === selectedAppointment.id ? { ...app, accepted: true } : app
      )
    );
    setConfirmAlertVisible(false);
    setTimeout(() => setSuccessAlertVisible(true), 300);
  };

  const handleReschedule = (item) => {
    setSelectedAppointment(item);
    setCalendarVisible(true);
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    setCalendarVisible(false);
    setTimeModalVisible(true);
  };

  const handleTimeSelect = (time) => {
    const updatedAppointments = appointments.map(app => {
      if (app.id === selectedAppointment.id) {
        const dateObj = new Date(selectedDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('fr-FR', options);
        return { ...app, date: formattedDate, time };
      }
      return app;
    });

    setAppointments(updatedAppointments);
    setTimeModalVisible(false);
    setTimeout(() => setRescheduleSuccessAlertVisible(true), 300);
  };

  const renderAppointmentItem = ({ item }) => (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.patientName}>{item.patientName}</Text>
      </View>
      <View style={styles.appointmentDetails}>
        <View style={styles.detailItem}>
          <FontAwesome5 name="calendar-alt" size={14} color="#666" />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <FontAwesome5 name="clock" size={14} color="#666" />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.acceptButton,
            item.accepted && styles.acceptedButton
          ]}
          onPress={() => handleAccept(item)}
        >
          <FontAwesome5 name="check" size={12} color="#fff" />
          <Text style={styles.buttonText}>Accepter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rescheduleButton} onPress={() => handleReschedule(item)}>
          <FontAwesome5 name="redo" size={12} color="#4A90E2" />
          <Text style={[styles.buttonText, { color: '#4A90E2' }]}>Replanifier</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header name=" Mes Rendez-vous" screen="DashboardDoctor" />
      <FlatList
        data={appointments}
        renderItem={renderAppointmentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />

      <Modal animationType="slide" transparent visible={calendarVisible} onRequestClose={() => setCalendarVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Sélectionnez une nouvelle date</Text>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{ [selectedDate]: { selected: true, selectedColor: '#4A90E2' } }}
              minDate={new Date().toISOString().split('T')[0]}
              theme={{ todayTextColor: '#4A90E2', arrowColor: '#4A90E2', selectedDayBackgroundColor: '#4A90E2' }}
            />
            <TouchableOpacity style={styles.cancelButton} onPress={() => setCalendarVisible(false)}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={timeModalVisible} onRequestClose={() => setTimeModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Sélectionnez une heure</Text>
            <FlatList
              data={availableTimes}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.timeItem} onPress={() => handleTimeSelect(item)}>
                  <Text style={styles.timeText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity style={styles.cancelButton} onPress={() => setTimeModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CustomAlert
        visible={confirmAlertVisible}
        type="question"
        title="Confirmation du Rendez-vous"
        message={`Êtes-vous sûr d'accepter le rendez-vous avec ${selectedAppointment?.patientName} le ${selectedAppointment?.date} à ${selectedAppointment?.time} ?`}
        onConfirm={confirmAppointment}
        onCancel={() => setConfirmAlertVisible(false)}
        confirmText="Accepter"
        cancelText="Annuler"
      />

      <CustomAlert
        visible={successAlertVisible}
        type="success"
        title="Rendez-vous Confirmé"
        message="Le rendez-vous a été confirmé avec succès!"
        onConfirm={() => setSuccessAlertVisible(false)}
        confirmText="OK"
      />

      <CustomAlert
        visible={rescheduleSuccessAlertVisible}
        type="success"
        title="Rendez-vous Replanifié"
        message={selectedAppointment ?
          `Le rendez-vous avec ${selectedAppointment.patientName} a été replanifié pour le ${new Date(selectedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à ${selectedAppointment.time}.`
          : "Le rendez-vous a été replanifié avec succès."}
        onConfirm={() => setRescheduleSuccessAlertVisible(false)}
        confirmText="OK"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 14, paddingTop: 45 },
  listContent: { paddingBottom: 20 },
  appointmentCard: {
    backgroundColor: '#fafbfc', borderRadius: 10, padding: 7, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05,
    shadowRadius: 2, elevation: 2, marginVertical: 5, marginHorizontal: 0.3
  },
  appointmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  patientName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  appointmentDetails: { flexDirection: 'row', marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  detailText: { marginLeft: 6, fontSize: 13, color: '#555' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  acceptButton: {
    flexDirection: 'row', backgroundColor: '#8bbf8b', paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 6, alignItems: 'center', gap: 6
  },
  acceptedButton: {
    backgroundColor: '#2e7d32' // vert foncé une fois accepté
  },
  rescheduleButton: {
    flexDirection: 'row', borderWidth: 1, borderColor: '#4A90E2',
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center', gap: 6
  },
  buttonText: { fontSize: 13, fontWeight: '500', color: '#fff' },
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'white' },
  modalView: {
    width: '90%', maxHeight: '80%', backgroundColor: "white", borderRadius: 20, padding: 20,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25,
    shadowRadius: 4, elevation: 5
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 15, textAlign: "center" },
  cancelButton: { backgroundColor: "#f2f2f2", borderRadius: 10, padding: 10, elevation: 2, marginTop: 15 },
  cancelButtonText: { color: "#333", fontWeight: "bold", textAlign: "center" },
  timeItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  timeText: { fontSize: 16, textAlign: 'center' }
});

export default AppointmentsList;
