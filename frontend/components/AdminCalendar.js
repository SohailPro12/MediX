import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Button,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import moment from "moment";
import { API_URL } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const AdminCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [inputDate, setInputDate] = useState("");
  const [consultations, setConsultations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchConsultations = async (date) => {
    try {
      setLoading(true);
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const token = await AsyncStorage.getItem('authToken');
      
      const response = await fetch(
        `${API_URL}/api/admin/consultations/date/${formattedDate}`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      const rawResponse = await response.text();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${rawResponse}`);
      }

      const data = JSON.parse(rawResponse);
      setConsultations(data);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      setConsultations([]);
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selected) => {
    setShowDatePicker(Platform.OS === 'ios'); // On iOS, keep picker open
    if (selected) {
      setSelectedDate(selected);
      setInputDate(moment(selected).format("YYYY-MM-DD"));
      fetchConsultations(selected);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const renderConsultation = ({ item }) => (
    <View style={styles.consultationItem}>
      <Text>Patient ID: {item.PatientId}</Text>
      <Text>Doctor ID: {item.MedecinId}</Text>
      <Text>Time: {moment(item.date).format("HH:mm")}</Text>
      <Text>Location: {item.lieu}</Text>
      <Text>Notes: {item.observation || "None"}</Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.label}>Select a date:</Text>
        
        <TouchableOpacity onPress={showDatepicker} style={styles.dateInput}>
          <Text>{inputDate || "Tap to select date"}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        {loading && <Text>Loading...</Text>}

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {selectedDate
                  ? `Consultations for ${moment(selectedDate).format("MMMM D, YYYY")}`
                  : "Consultations"}
              </Text>

              {consultations.length > 0 ? (
                <FlatList
                  data={consultations}
                  renderItem={renderConsultation}
                  keyExtractor={(item) => item._id}
                />
              ) : (
                <Text>No consultations scheduled for this date</Text>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  consultationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default AdminCalendar;