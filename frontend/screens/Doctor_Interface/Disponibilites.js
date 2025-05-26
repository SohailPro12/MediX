import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../../components/DoctorComponents/Header";

const DisponibiliteScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [hoursByDate, setHoursByDate] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(null);
  const [fromTime, setFromTime] = useState(new Date());
  const [toTime, setToTime] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const toggleDate = (dateString) => {
    const alreadySelected = selectedDates[dateString];
    if (alreadySelected) {
      const updatedDates = { ...selectedDates };
      delete updatedDates[dateString];
      setSelectedDates(updatedDates);

      const updatedHours = { ...hoursByDate };
      delete updatedHours[dateString];
      setHoursByDate(updatedHours);
    } else {
      setSelectedDates({
        ...selectedDates,
        [dateString]: {
          selected: true,
          selectedColor: "#28A745",
        },
      });
      const now = new Date();
      setFromTime(now);
      setToTime(new Date(now.getTime() + 60 * 60 * 1000));
      setCurrentDate(dateString);
      setModalVisible(true);
    }
  };

  const saveTimeForDate = () => {
    if (toTime <= fromTime) {
      Alert.alert("Erreur", "L'heure de fin doit être après l'heure de début.");
      return;
    }

    const from = fromTime.toTimeString().slice(0, 5);
    const to = toTime.toTimeString().slice(0, 5);

    setHoursByDate({
      ...hoursByDate,
      [currentDate]: { from, to },
    });

    setModalVisible(false);
  };

  const closeModalWithoutSaving = () => {
    const updatedDates = { ...selectedDates };
    delete updatedDates[currentDate];
    setSelectedDates(updatedDates);
    setModalVisible(false);
  };

  const showTimePicker = (type) => {
    if (type === "from") setShowFromPicker(true);
    else setShowToPicker(true);
  };

  const handleTimeChange = (event, selectedDate, type) => {
    if (!selectedDate) return;
    if (type === "from") {
      setFromTime(selectedDate);
      setShowFromPicker(false);
    } else {
      setToTime(selectedDate);
      setShowToPicker(false);
    }
  };

  const handleSave = () => {
    const disponibilites = Object.entries(hoursByDate).map(([date, hours]) => ({
      date,
      heureDebut: hours.from,
      heureFin: hours.to,
    }));

    console.log("Disponibilités à envoyer :", disponibilites);
    Alert.alert("Succès", "Vos disponibilités ont été enregistrées !");
  };

  return (
    <View style={styles.container}>
      <Header
        name="Choisis tes jours & heures disponibles"
        screen="DashboardDoctor"
      />

      <Calendar
        current={getTodayDate()}
        markedDates={selectedDates}
        onDayPress={(day) => toggleDate(day.dateString)}
        theme={{
          selectedDayBackgroundColor: "#28A745",
          todayTextColor: "#FF5733",
        }}
        style={{
          backgroundColor: "#fbfcfd",
          borderRadius: 12,
          padding: 10,
          elevation: 2,
        }}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Heures pour {currentDate}</Text>

          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => showTimePicker("from")}
          >
            <Text style={styles.timeText}>
              De : {fromTime.toTimeString().slice(0, 5)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => showTimePicker("to")}
          >
            <Text style={styles.timeText}>
              À : {toTime.toTimeString().slice(0, 5)}
            </Text>
          </TouchableOpacity>

          {showFromPicker && (
            <DateTimePicker
              value={fromTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(e, d) => handleTimeChange(e, d, "from")}
            />
          )}

          {showToPicker && (
            <DateTimePicker
              value={toTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(e, d) => handleTimeChange(e, d, "to")}
            />
          )}

          <TouchableOpacity style={styles.saveButton} onPress={saveTimeForDate}>
            <Text style={styles.saveText}>Enregistrer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: "#dc3545" }]}
            onPress={closeModalWithoutSaving}
          >
            <Text style={styles.saveText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ScrollView style={styles.hoursList}>
        <Text style={styles.hoursListTitle}>Jours sélectionnés :</Text>
        {Object.entries(hoursByDate).map(([date, { from, to }]) => (
          <Text key={date} style={styles.hourItem}>
            {date} : {from} - {to}
          </Text>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.finalSave} onPress={handleSave}>
        <Text style={styles.finalSaveText}>
          Valider toutes les disponibilités
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#fbfcfd",
    marginTop: 15,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 25,
    margin: 30,
    borderRadius: 12,
    elevation: 5,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 15 },
  timeButton: {
    backgroundColor: "#eee",
    padding: 12,
    marginVertical: 8,
    width: "100%",
    borderRadius: 8,
  },
  timeText: { textAlign: "center", fontSize: 16 },
  saveButton: {
    backgroundColor: "#28A745",
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  saveText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  finalSave: {
    backgroundColor: "#007bff",
    padding: 15,
    marginTop: 30,
    borderRadius: 10,
  },
  finalSaveText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  hoursList: {
    marginTop: 20,
    maxHeight: 150, // pour limiter la taille et activer le scroll
  },
  hoursListTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  hourItem: { fontSize: 16, marginVertical: 4 },
});

export default DisponibiliteScreen;
