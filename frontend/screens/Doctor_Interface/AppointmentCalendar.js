import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Header from "../../components/DoctorComponents/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";

const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState([]);
  const [weekNumber, setWeekNumber] = useState("");
  const [appointments, setAppointments] = useState([]);
  const timeSlots = ["Matinée", "Midi", "Après-midi", "Soir"];

  useEffect(() => {
    generateWeek();
  }, [selectedDate]);

  const generateWeek = () => {
    const days = [];
    const base = new Date(selectedDate);
    const firstDay = new Date(base.setDate(base.getDate() - base.getDay() + 1)); // Lundi

    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + i);
      const label = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][i];
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      const formatted = data.map((item) => {
        const date = new Date(item.date);
        let timeSlot = 0;
        const hour = date.getHours();

        if (hour < 11) timeSlot = 0;
        else if (hour < 14) timeSlot = 1;
        else if (hour < 18) timeSlot = 2;
        else timeSlot = 3;

        return {
          id: item._id,
          title: item.observation || "RDV",
          date,
          timeSlot,
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
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    return `${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  };

  const getAppointment = (dayIndex, timeSlot) => {
    const targetDate = weekDays[dayIndex]?.date;
    if (!targetDate) return null;

    return appointments.find(
      (appt) =>
        appt.date.getDate() === targetDate.getDate() &&
        appt.date.getMonth() === targetDate.getMonth() &&
        appt.date.getFullYear() === targetDate.getFullYear() &&
        appt.timeSlot === timeSlot
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name="Calendrier"
        marginl={"13%"}
        marginlc={"16%"}
        screen="DashboardDoctor"
      />

      <View style={styles.calendarContainer}>
        <Text style={styles.title}>Table Rendez-vous</Text>

        <View style={styles.monthSelector}>
          <TouchableOpacity
            style={styles.arrow}
            onPress={() => navigateWeek(-1)}
          >
            <Text style={styles.arrowText}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.month}>{getMonthYear()}</Text>
          <TouchableOpacity
            style={styles.arrow}
            onPress={() => navigateWeek(1)}
          >
            <Text style={styles.arrowText}>{">"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.weekText}>Semaine {weekNumber}</Text>

        <View style={styles.daysHeader}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.dayText}>
              {day.label}
            </Text>
          ))}
        </View>

        {timeSlots.map((slot, timeIndex) => (
          <View key={timeIndex} style={styles.timeRow}>
            <View style={styles.timeSlot}>
              <Text style={styles.timeText}>{slot}</Text>
            </View>
            {[...Array(7).keys()].map((dayIndex) => {
              const appt = getAppointment(dayIndex, timeIndex);
              return (
                <View key={dayIndex} style={styles.cell}>
                  {appt && (
                    <View style={styles.appointment}>
                      <Text style={styles.appointmentText}>{appt.title}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
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
    margin: 2,
    borderWidth: 1,
    borderColor: "#4287f5",
    borderRadius: 5,
    marginTop: 25,
  },
  title: { fontSize: 16, fontWeight: "bold", padding: 10, color: "#4287f5" },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  arrow: { padding: 10 },
  arrowText: { fontSize: 20, fontWeight: "bold" },
  month: { fontSize: 16 },
  weekText: { fontSize: 14, paddingLeft: 10, paddingVertical: 5 },
  daysHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dayText: { flex: 1, textAlign: "center", paddingVertical: 5, fontSize: 12 },
  timeRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    height: 80,
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
  appointmentText: { color: "white", fontSize: 10, textAlign: "center" },
});

export default AppointmentCalendar;
