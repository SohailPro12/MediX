import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import moment from "moment";
import { API_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";

const AdminCalendar = () => {
  const { t } = useTranslation();
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
      const token = await AsyncStorage.getItem("authToken");

      const response = await fetch(
        `${API_URL}/api/admin/consultations/date/${formattedDate}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const rawResponse = await response.text();
      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${rawResponse}`
        );
      }

      const data = JSON.parse(rawResponse);
      setConsultations(data);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      setConsultations([]);
    } finally {
      setModalVisible(true);
      setLoading(false);
    }
  };

  const handleDateChange = (event, selected) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selected) {
      setSelectedDate(selected);
      const formatted = moment(selected).format("YYYY-MM-DD");
      setInputDate(formatted);
      fetchConsultations(selected);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const renderConsultation = ({ item }) => (
    <View style={styles.consultationItem}>
      <Text>{t("calendar.patientId")}: {item.PatientId}</Text>
      <Text>{t("calendar.doctorId")}: {item.MedecinId}</Text>
      <Text>{t("calendar.time")}: {moment(item.date).format("HH:mm")}</Text>
      <Text>{t("calendar.location")}: {item.lieu}</Text>
      <Text>
        {t("calendar.notes")}: {item.observation || t("calendar.none")}
      </Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.label}>{t("calendar.selectDate")}:</Text>

        <TouchableOpacity onPress={showDatepicker} style={styles.dateInput}>
          <Text>{inputDate || t("calendar.tapToSelect")}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}

        {loading && <Text>{t("common.loading")}...</Text>}

        <Modal
          visible={modalVisible}
          transparent
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
                  ? `${t("calendar.consultationsFor")} ${moment(selectedDate).format("MMMM D, YYYY")}`
                  : t("calendar.title")}
              </Text>

              {consultations.length > 0 ? (
                <FlatList
                  data={consultations}
                  renderItem={renderConsultation}
                  keyExtractor={(item) => item._id}
                />
              ) : (
                <Text>{t("calendar.noConsultations")}</Text>
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
    borderColor: "#ccc",
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
