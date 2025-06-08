// screens/Doctor/Dashboard.jsx
import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import StatCard from "../../components/DoctorComponents/StatCard";
import MenuCard from "../../components/DoctorComponents/MenuCard";
import ProfileBar from "../../components/DoctorComponents/ProfileBar";
import NavigationBar from "../../components/DoctorComponents/NavigationBar";
import { useMedecin } from "../context/MedecinContext";
import { fetchAppointments } from "../../utils_Doctor/MedecinAppointement";
import { fetchPatients } from "../../utils_Doctor/ListePatients";

const Dashboard = () => {
  const navigation = useNavigation();
  const { medecin } = useMedecin();
  const { t } = useTranslation();

  const [rdvCount, setRdvCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!medecin?._id) return;
    setRefreshing(true);
    try {
      const [appointments, patients] = await Promise.all([
        fetchAppointments(medecin._id, "confirmed", true),
        fetchPatients(medecin._id),
      ]);
      setRdvCount(appointments.length);
      setPatientCount(patients.length);
    } catch (err) {
      console.error("🔴 Erreur chargement Dashboard:", err);
    } finally {
      setRefreshing(false);
    }
  }, [medecin?._id]);

  // Reload on focus:
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadData}
            colors={["#75E1E5"]}
            tintColor="#75E1E5"
          />
        }
      >
        <ProfileBar screen="SettingsDScreen" />

        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statButton}
            onPress={() => navigation.navigate("NextRdv")}
            activeOpacity={0.8}
          >
            {" "}
            <StatCard
              icon="calendar-alt"
              label={t("doctor.dashboard.nextAppointment")}
              value={refreshing ? "…" : rdvCount}
              color="#FF5733"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statButton}
            onPress={() => navigation.navigate("PatientSuivi")}
            activeOpacity={0.8}
          >
            {" "}
            <StatCard
              icon="user-friends"
              label={t("doctor.dashboard.totalPatients")}
              value={refreshing ? "…" : patientCount}
              color="#33A1FF"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("AppointmentsList")}
            activeOpacity={0.8}
          >
            <MenuCard
              icon="calendar-check"
              label={t("doctor.appointments.title")}
              color="#FF5733"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("Ordonnance")} //a verifier (OrdonnaceList)
            activeOpacity={0.8}
          >
            <MenuCard
              icon="file-document-edit"
              label={t("doctor.prescriptions.title")}
              color="#28A745"
            />
          </TouchableOpacity>
        </View>

        {/* ✅ Section séparée pour la carte Mes Disponibilités */}
        <View style={styles.bottomCardContainer}>
          <TouchableOpacity
            style={styles.bottomStatButton}
            onPress={() => navigation.navigate("Disponibilites")}
            activeOpacity={0.8}
          >
            {" "}
            <StatCard
              icon="clock"
              label={t("doctor.calendar.availability")}
              value={t("doctor.calendar.setAvailability")}
              color="#28A745"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // 🔁 permet d’afficher plus de 2 cards
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statButton: {
    width: "48%", // 📏 important pour 3 cards sur 2 lignes
    marginBottom: 15,
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  bottomCardContainer: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: "center",
  },
  bottomStatButton: {
    width: "80%",
  },

  menuButton: {
    width: "48%",
    marginBottom: 15,
  },
});

export default Dashboard;
