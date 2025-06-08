import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import Header from "../../components/DoctorComponents/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import { useNavigation } from "@react-navigation/native";

const AppointmentCalendar = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [weekNumber, setWeekNumber] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const timeSlots = [
    t("doctor.calendar.timeSlotLabels.morning"),
    t("doctor.calendar.timeSlotLabels.noon"),
    t("doctor.calendar.timeSlotLabels.afternoon"),
    t("doctor.calendar.timeSlotLabels.evening"),
  ];

  useEffect(() => {
    generateWeek();
  }, [selectedDate]);
  const generateWeek = () => {
    const days = [];
    const base = new Date(selectedDate);
    const firstDay = new Date(base.setDate(base.getDate() - base.getDay() + 1)); // Lundi

    const dayLabels = [
      t("doctor.calendar.days.monday"),
      t("doctor.calendar.days.tuesday"),
      t("doctor.calendar.days.wednesday"),
      t("doctor.calendar.days.thursday"),
      t("doctor.calendar.days.friday"),
      t("doctor.calendar.days.saturday"),
      t("doctor.calendar.days.sunday"),
    ];

    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + i);
      const label = dayLabels[i];
      days.push({ date, label: `${label} ${date.getDate()}` });
    }

    setWeekDays(days);
    setWeekNumber(getWeekNumber(days[0].date));
    fetchAppointments(days[0].date, days[6].date);
  };

  const getWeekNumber = (date) => {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff =
      date -
      start +
      (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000;
    return Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
  };
  const fetchAppointments = async (start, end) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const res = await fetch(
        `${API_URL}/api/doctor/appointments?start=${start.toISOString()}&end=${end.toISOString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      console.log("Appointments raw:", data);

      const formatted = data.map((item) => {
        const date = new Date(item.date);
        let timeSlot = 0;
        const hour = date.getHours();
        if (hour < 11) timeSlot = 0;
        else if (hour < 14) timeSlot = 1;
        else if (hour < 18) timeSlot = 2;
        else timeSlot = 3;

        return {
          id: item.id || item._id, // id pour naviguer
          title: item.observation || "RDV",
          date,
          timeSlot,
          ordonnanceId: item.ordonnanceId ?? null, // <-- bien ici !
        };
      });

      setAppointments(formatted);
    } catch (error) {
      console.error("Erreur fetch RDV:", error);
    }
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setSelectedDate(newDate);
  };
  const getMonthYear = () => {
    const months = [
      t("doctor.calendar.months.january"),
      t("doctor.calendar.months.february"),
      t("doctor.calendar.months.march"),
      t("doctor.calendar.months.april"),
      t("doctor.calendar.months.may"),
      t("doctor.calendar.months.june"),
      t("doctor.calendar.months.july"),
      t("doctor.calendar.months.august"),
      t("doctor.calendar.months.september"),
      t("doctor.calendar.months.october"),
      t("doctor.calendar.months.november"),
      t("doctor.calendar.months.december"),
    ];
    return `${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  };

  const getAppointment = (d, t) => {
    const targetDate = weekDays[d]?.date;
    if (!targetDate) return null;
    return appointments.find(
      (a) =>
        a.date.getDate() === targetDate.getDate() &&
        a.date.getMonth() === targetDate.getMonth() &&
        a.date.getFullYear() === targetDate.getFullYear() &&
        a.timeSlot === t
    );
  };

  const handleAppointmentPress = (appt) => {
    setSelectedAppointment(appt);
    setModalVisible(true);
  };

  const goToCreateOrdonnance = () => {
    console.log(
      "appointmentid and ordonnanceId",
      selectedAppointment.id,
      selectedAppointment.ordonnanceId
    );
    setModalVisible(false);
    navigation.navigate("AddOrdonnanceScreen", {
      appointmentId: selectedAppointment.id,
      ordonnanceId: selectedAppointment.ordonnanceId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={t("doctor.calendar.title")}
        marginl="13%"
        marginlc="16%"
        screen="DashboardDoctor"
      />
      <View style={styles.calendarContainer}>
        <Text style={styles.title}>
          {t("doctor.calendar.appointmentTable")}
        </Text>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => navigateWeek(-1)}>
            <Text style={styles.arrowText}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.month}>{getMonthYear()}</Text>
          <TouchableOpacity onPress={() => navigateWeek(1)}>
            <Text style={styles.arrowText}>{">"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.weekText}>
          {t("doctor.calendar.week")} {weekNumber}
        </Text>
        <View style={styles.daysHeader}>
          {weekDays.map((day, i) => (
            <Text key={i} style={styles.dayText}>
              {day.label}
            </Text>
          ))}
        </View>

        {timeSlots.map((slot, ti) => (
          <View key={ti} style={styles.timeRow}>
            <View style={styles.timeSlot}>
              <Text style={styles.timeText}>{slot}</Text>
            </View>
            {[...Array(7).keys()].map((di) => {
              const appt = getAppointment(di, ti);
              return (
                <TouchableOpacity
                  key={di}
                  style={styles.cell}
                  onPress={() => appt && handleAppointmentPress(appt)}
                >
                  {appt && (
                    <View style={styles.appointment}>
                      <Text style={styles.appointmentText}>{appt.title}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>{" "}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t("doctor.calendar.modal.title")}
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={goToCreateOrdonnance}
            >
              <Text style={styles.modalButtonText}>
                {selectedAppointment?.ordonnanceId
                  ? t("doctor.calendar.modal.editPrescription")
                  : t("doctor.calendar.modal.addPrescription")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "grey" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>{t("common.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 45,
    padding: "3%",
  },
  calendarContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#4287f5",
    borderRadius: 5,
    marginTop: 25,
  },
  title: { fontSize: 16, fontWeight: "bold", padding: 10, color: "#4287f5" },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  arrowText: { fontSize: 20, fontWeight: "bold" },
  month: { fontSize: 16 },
  weekText: { fontSize: 14, padding: 5 },
  daysHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dayText: { flex: 1, textAlign: "center", padding: 5, fontSize: 12 },
  timeRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    height: 80,
  },
  timeSlot: {
    width: 50,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#eee",
    paddingLeft: 5,
  },
  timeText: { fontSize: 12 },
  cell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  appointment: {
    backgroundColor: "#4287f5",
    width: "100%",
    height: "96%",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  appointmentText: { color: "#fff", fontSize: 10 },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  modalButton: {
    backgroundColor: "#75E1E5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default AppointmentCalendar;
