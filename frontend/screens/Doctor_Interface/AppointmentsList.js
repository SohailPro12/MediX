import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ActivityIndicator, RefreshControl } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import CustomAlert from '../../components/DoctorComponents/CustomAlert';
import Header from '../../components/DoctorComponents/Header';
import { useMedecin } from './../context/MedecinContext'; 
import { fetchAppointments } from "../../utils_Docror/MedecinAppointement"; // Assurez-vous que le chemin est correct
import { confirmerAppointmentRequest } from "../../utils_Docror/confirmerAppoint";
import { rescheduleAppointmentRequest } from "../../utils_Docror/rescheduleAppo";
import { useNavigation } from '@react-navigation/native';

const AppointmentsList = () => {
  const navigation = useNavigation();
  const { medecin } = useMedecin(); 
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const [confirmAlertVisible, setConfirmAlertVisible] = useState(false);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [rescheduleSuccessAlertVisible, setRescheduleSuccessAlertVisible] = useState(false);

  const availableTimes = ['08:00', '09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '16:00', '16:30'];

  const loadAppointments = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await fetchAppointments(medecin?._id, "pending");
      setAppointments(data);
      setError(null);
    } catch (error) {
      setError("Erreur de récupération des rendez-vous.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [medecin?._id]);

  // Chargement initial
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Actualisation lors du focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadAppointments);
    return unsubscribe;
  }, [navigation, loadAppointments]);

  // Fonction de rafraîchissement manuel
  const onRefresh = useCallback(() => {
    loadAppointments();
  }, [loadAppointments]);

  const confirmerAppo = async () => {
    if (!selectedAppointment) return;
    setProcessing(true);
    try {
      await confirmerAppointmentRequest(selectedAppointment._id);
      await loadAppointments();
      setConfirmAlertVisible(false);
      setTimeout(() => setSuccessAlertVisible(true), 300);
    } catch (error) {
      console.error("Erreur lors de la confirmation:", error);
      setError("Erreur lors de la confirmation du rendez-vous.");
    } finally {
      setProcessing(false);
    }
  };

  const handleAccept = (item) => {
    setSelectedAppointment(item);
    setConfirmAlertVisible(true);
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

  const handleTimeSelect = async (time) => {
    if (!selectedAppointment) return;
    setSelectedTime(time);
    setProcessing(true);

    const dateTimeString = `${selectedDate}T${time}:00`;
    try {
      await rescheduleAppointmentRequest(selectedAppointment._id, dateTimeString);
      await loadAppointments();
      setTimeModalVisible(false);
      setTimeout(() => setRescheduleSuccessAlertVisible(true), 300);
    } catch (error) {
      console.error('Erreur lors de la replanification:', error);
      setError('Erreur lors de la replanification.');
    } finally {
      setProcessing(false);
    }
  };

  const renderAppointmentItem = ({ item }) => {
    if (!item || !item.PatientId) {
      return null;
    }

    const patient = item.PatientId;
    const appointmentDate = new Date(item.date);
    const formattedDate = appointmentDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const formattedTime = appointmentDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <Text style={styles.patientName}>{patient.nom} {patient.prenom}</Text>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailItem}>
            <FontAwesome5 name="heartbeat" size={14} color="#666" />
            <Text style={styles.detailText}>{item.motif}</Text>
          </View>

          <View style={styles.detailItem}>
            <FontAwesome5 name="file-alt" size={14} color="#666" />
            <Text style={styles.detailText}>{item.observation}</Text>
          </View>

          <View style={[styles.detailItem, styles.dateTimeContainer]}>
            <FontAwesome5 name="calendar-alt" size={14} color="#666" />
            <Text style={styles.detailText}>{formattedDate}</Text>
            <FontAwesome5 name="clock" size={14} color="#666" style={styles.timeIcon} />
            <Text style={styles.detailText}>{formattedTime}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.acceptButton,
              item.accepted && styles.acceptedButton,
              processing && styles.disabledButton
            ]}
            onPress={() => handleAccept(item)}
            disabled={processing}
          >
            {processing && selectedAppointment?._id === item._id ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <FontAwesome5 name="check" size={12} color="#fff" />
                <Text style={styles.buttonText}>Accepter</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.rescheduleButton, 
              processing && styles.disabledButton
            ]}
            onPress={() => handleReschedule(item)}
            disabled={processing}
          >
            <FontAwesome5 name="redo" size={12} color="#4A90E2" />
            <Text style={[styles.buttonText, { color: '#4A90E2' }]}>Replanifier</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header name="Mes Rendez-vous" screen="DashboardDoctor" />

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text>Chargement des rendez-vous...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : appointments.length === 0 ? (
        <Text style={styles.emptyText}>Aucun rendez-vous à afficher</Text>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4A90E2"]}
              tintColor="#4A90E2"
            />
          }
        />
      )}

      {/* Modal Calendrier */}
      <Modal animationType="slide" transparent visible={calendarVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Sélectionnez une nouvelle date</Text>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{ [selectedDate]: { selected: true, selectedColor: '#4A90E2' } }}
              minDate={new Date().toISOString().split('T')[0]}
              theme={{ 
                todayTextColor: '#4A90E2', 
                arrowColor: '#4A90E2', 
                selectedDayBackgroundColor: '#4A90E2' 
              }}
            />
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setCalendarVisible(false)}
              disabled={processing}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Sélection heure */}
      <Modal animationType="slide" transparent visible={timeModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Sélectionnez une heure</Text>
            {processing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
              </View>
            ) : (
              <FlatList
                data={availableTimes}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.timeItem} 
                    onPress={() => handleTimeSelect(item)}
                    disabled={processing}
                  >
                    <Text style={styles.timeText}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />
            )}
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setTimeModalVisible(false)}
              disabled={processing}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Alertes */}
      <CustomAlert
        visible={confirmAlertVisible}
        type="question"
        title="Confirmation du Rendez-vous"
        message={
          selectedAppointment ? 
            `Êtes-vous sûr d'accepter le rendez-vous avec ${selectedAppointment.PatientId.nom} ${selectedAppointment.PatientId.prenom} le ${new Date(selectedAppointment.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à ${new Date(selectedAppointment.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} ?`
            : ''
        }
        onConfirm={confirmerAppo}
        onCancel={() => setConfirmAlertVisible(false)}
        confirmText={processing ? "Traitement..." : "Accepter"}
        cancelText="Annuler"
        confirmDisabled={processing}
      />

      <CustomAlert
        visible={successAlertVisible}
        type="success"
        title="Rendez-vous Confirmé"
        message="Le rendez-vous a été confirmé avec succès !"
        onConfirm={() => setSuccessAlertVisible(false)}
        confirmText="OK"
      />

      <CustomAlert
        visible={rescheduleSuccessAlertVisible}
        type="success"
        title="Rendez-vous Replanifié"
        message={
          selectedAppointment && selectedDate
            ? `Le rendez-vous avec ${selectedAppointment.PatientId.nom} a été replanifié pour le ${new Date(selectedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à ${selectedTime}.`
            : "Le rendez-vous a été replanifié avec succès."
        }
        onConfirm={() => setRescheduleSuccessAlertVisible(false)}
        confirmText="OK"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 14, paddingTop: 45 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#666' },
  listContent: { paddingBottom: 20 },
  appointmentCard: {
    backgroundColor: '#fafbfc', 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 12,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05,
    shadowRadius: 2, 
    elevation: 2
  },
  appointmentHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  patientName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  appointmentDetails: { 
    marginTop: 8, 
    marginBottom: 12 
  },
  detailItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  detailText: { 
    marginLeft: 8, 
    fontSize: 14, 
    color: '#555' 
  },
  dateTimeContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 8 
  },
  timeIcon: { 
    marginLeft: 10 
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 10 
  },
  acceptButton: {
    flexDirection: 'row', 
    backgroundColor: '#8bbf8b', 
    paddingVertical: 6, 
    paddingHorizontal: 12,
    borderRadius: 6, 
    alignItems: 'center', 
    gap: 6
  },
  acceptedButton: { 
    backgroundColor: '#2e7d32' 
  },
  disabledButton: {
    opacity: 0.6
  },
  rescheduleButton: {
    flexDirection: 'row', 
    borderWidth: 1, 
    borderColor: '#4A90E2',
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 6, 
    alignItems: 'center', 
    gap: 6
  },
  buttonText: { 
    fontSize: 13, 
    fontWeight: '500', 
    color: '#fff' 
  },
  centeredView: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalView: { 
    width: '90%', 
    maxHeight: '80%', 
    backgroundColor: "white", 
    borderRadius: 20, 
    padding: 20, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 4, 
    elevation: 5 
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: "600", 
    marginBottom: 15, 
    textAlign: "center" 
  },
  cancelButton: { 
    backgroundColor: "#f2f2f2", 
    borderRadius: 10, 
    padding: 10, 
    elevation: 2, 
    marginTop: 15 
  },
  cancelButtonText: { 
    color: "#333", 
    fontWeight: "bold", 
    textAlign: "center" 
  },
  timeItem: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  timeText: { 
    fontSize: 16, 
    textAlign: 'center' 
  },
  errorText: { 
    color: 'red', 
    textAlign: 'center', 
    marginTop: 20 
  }
});

export default AppointmentsList;