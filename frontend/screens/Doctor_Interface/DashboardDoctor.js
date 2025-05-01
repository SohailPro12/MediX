import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, RefreshControl, ScrollView } from "react-native";
import StatCard from "../../components/DoctorComponents/StatCard";
import MenuCard from "../../components/DoctorComponents/MenuCard";
import ProfileBar from "../../components/DoctorComponents/ProfileBar";
import NavigationBar from "../../components/DoctorComponents/NavigationBar";
import { useNavigation } from "@react-navigation/native";
import { useMedecin } from "../context/MedecinContext"; 
import { fetchAppointments } from "../../utils/MedecinAppointement"; 
import { fetchPatients } from "../../utils/ListePatients";

const Dashboard = () => {
  const navigation = useNavigation();
  const { medecin } = useMedecin();
  const [rdvCount, setRdvCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!medecin?._id) return;
    
    try {
      setRefreshing(true);
      const [appointments, patients] = await Promise.all([
        fetchAppointments(medecin._id, "confirmed", true),
        fetchPatients(medecin._id)
      ]);
      setRdvCount(appointments.length);
      setPatientCount(patients.length);
    } catch (err) {
      console.error("Erreur chargement:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [medecin]);

  // Effet pour le chargement initial
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Actualisation lors du focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation, loadData]);

  // Fonction de rafraîchissement manuel
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#75E1E5"]}
            tintColor="#75E1E5"
          />
        }
      >
        <ProfileBar screen='SettingsDScreen'/>
        
        <View style={styles.statsContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("NextRdv")}
            activeOpacity={0.8}
            style={styles.statButton}
          >
            <StatCard
              icon="calendar-alt"
              label="Prochains RDV"
              value={loading ? "..." : rdvCount}
              color="#FF5733"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("PatientSuivi")}
            activeOpacity={0.8}
            style={styles.statButton}
          >
            <StatCard
              icon="user-friends"
              label="Patients Suivis"
              value={loading ? "..." : patientCount}
              color="#33A1FF"
            />
          </TouchableOpacity>

          <View style={styles.statButton}>
            <StatCard 
              icon="prescription-bottle" 
              label="Traitements" 
              value="45" 
              color="#28A745" 
            />
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("AppointmentsList")}
            activeOpacity={0.8}
            style={styles.menuButton}
          >
            <MenuCard icon="calendar-check" label="Mes Rendez-vous" color="#FF5733" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Ordonnance")}
            activeOpacity={0.8}
            style={styles.menuButton}
          >
            <MenuCard icon="file-document-edit" label="Ordonnances" color="#28A745" />
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
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  menuButton: {
    width: "48%",
    marginBottom: 15,
  },
});

export default Dashboard;