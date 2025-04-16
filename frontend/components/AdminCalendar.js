// components/AdminCalendar.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import { API_URL } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // components/AdminCalendar.jsx
  const fetchConsultations = async (date) => {
    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const token = await AsyncStorage.getItem('authToken');
      console.log("Token:", token); // Debugging line to check the token
      console.log("Fetching consultations for:", formattedDate);
      const response = await fetch(
        `${API_URL}/api/admin/consultations/date/${formattedDate}`, // Updated to /api/admin
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json' // Ensure server returns JSON
          }
        }
      );
      const rawResponse = await response.text();
      console.log('Raw response:', rawResponse);
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      const data = JSON.parse(rawResponse);
      console.log("Received data:", data);
      setConsultations(data);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      setConsultations([]);
      setModalVisible(true);
    }
  };

  const onDateChange = (date) => {
    setSelectedDate(date);
    fetchConsultations(date);
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
    <View style={styles.container}>
      <CalendarPicker
        onDateChange={onDateChange}
        width={350}
        todayBackgroundColor="#f2e6ff"
        selectedDayColor="#7300e6"
        selectedDayTextColor="#FFFFFF"
      />

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
                ? `Consultations for ${moment(selectedDate).format(
                    "MMMM D, YYYY"
                  )}`
                : "Consultations"}
            </Text>

            {consultations.length > 0 ? (
              <FlatList
                data={consultations}
                renderItem={renderConsultation}
                keyExtractor={(item) => item._id}
              />
            ) : (
              <Text>No consultations scheduled</Text>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
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
