import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import { useTranslation } from "react-i18next";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function MedicationPlanScreen() {
  const { t } = useTranslation();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  const WEEKDAYS = [
    t("patient.medication.weekdays.sunday"),
    t("patient.medication.weekdays.monday"),
    t("patient.medication.weekdays.tuesday"),
    t("patient.medication.weekdays.wednesday"),
    t("patient.medication.weekdays.thursday"),
    t("patient.medication.weekdays.friday"),
    t("patient.medication.weekdays.saturday"),
  ];

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const res = await fetch(`${API_URL}/api/medications/plan`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMedications(data);
      } catch (e) {
        console.error(e);
        Alert.alert(
          t("patient.medication.error"),
          t("patient.medication.loadError")
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#75E1E5" />
    );
  if (!medications.length)
    return (
      <Text style={styles.center}>{t("patient.medication.noTreatments")}</Text>
    );

  return (
    <ScrollView style={styles.container}>
      {WEEKDAYS.map((day, idx) => {
        const meds = medications.filter((m) => m.weekDays.includes(idx));
        if (!meds.length) return null;
        return (
          <View key={idx}>
            <Text style={styles.dayTitle}>{day}</Text>
            {meds.map((med) => (
              <MedicationItem key={med.id + idx} item={med} />
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

function MedicationItem({ item }) {
  const { t } = useTranslation();
  const { id, icon, name, dosage, duration, hour, minute, period } = item;
  const [taken, setTaken] = useState(false);
  const [alarm, setAlarm] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem(`taken_${id}`);
      const a = await AsyncStorage.getItem(`alarm_${id}`);
      setTaken(t === "1");
      setAlarm(a === "1");
    })();
  }, []);

  const markTaken = async () => {
    setTaken(true);
    await AsyncStorage.setItem(`taken_${id}`, "1");
  };

  const schedule = async () => {
    if (alarm) return;
    const permit = await Notifications.requestPermissionsAsync();
    if (permit.status !== "granted") {
      return Alert.alert(
        t("patient.medication.permissionsDenied"),
        t("patient.medication.cannotSchedule")
      );
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `💊 ${name}`,
        body: `${t("patient.medication.dosage")} : ${dosage} (${period})`,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
    setAlarm(true);
    await AsyncStorage.setItem(`alarm_${id}`, "1");
    Alert.alert(
      t("patient.medication.reminderActivated"),
      t("patient.medication.dailyAt", {
        hour,
        minute: minute < 10 ? "0" + minute : minute,
      })
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.icon}>{icon || "💊"}</Text>
        <View>
          <Text style={styles.medName}>{name}</Text>
          <Text style={styles.dosage}>
            {t("patient.medication.dosage")}: {dosage}
          </Text>
          <Text style={styles.time}>
            {t("patient.medication.time")}: {hour}h{minute < 10 ? "0" : ""}
            {minute} ({period})
          </Text>
          <Text style={styles.duration}>
            {t("patient.medication.duration")}: {duration}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, alarm ? styles.btnActive : styles.btnInactive]}
          onPress={schedule}
        >
          <Text style={styles.btnText}>{alarm ? "🔔" : "🔕"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, taken ? styles.btnTaken : styles.btnDefault]}
          onPress={markTaken}
        >
          <Text style={styles.btnText}>{taken ? "✅" : "⚪"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
    color: "#333",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 3 },
    }),
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  medName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  dosage: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  duration: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
    minWidth: 40,
    alignItems: "center",
  },
  btnActive: {
    backgroundColor: "#10B981",
  },
  btnInactive: {
    backgroundColor: "#9CA3AF",
  },
  btnTaken: {
    backgroundColor: "#059669",
  },
  btnDefault: {
    backgroundColor: "#6B7280",
  },
  btnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    textAlign: "center",
    marginTop: 50,
    color: "#666",
  },
});
